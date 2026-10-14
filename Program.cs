using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

// 1. تشغيل ملفات الموقع من فولدر wwwroot
app.UseDefaultFiles();
app.UseStaticFiles();

// 2. مسار ملف قاعدة البيانات وإعدادات قراءة الحروف (CamelCase & Case-Insensitive)
string dbFilePath = Path.Combine(app.Environment.ContentRootPath, "alnahar_database.json");

var jsonOptions = new JsonSerializerOptions
{
    PropertyNameCaseInsensitive = true,
    PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
    WriteIndented = true
};

AppDatabase LoadDb()
{
    if (!File.Exists(dbFilePath))
    {
        var initialDb = new AppDatabase();
        SaveDb(initialDb);
        return initialDb;
    }
    try
    {
        string json = File.ReadAllText(dbFilePath);
        return JsonSerializer.Deserialize<AppDatabase>(json, jsonOptions) ?? new AppDatabase();
    }
    catch
    {
        return new AppDatabase();
    }
}

void SaveDb(AppDatabase db)
{
    File.WriteAllText(dbFilePath, JsonSerializer.Serialize(db, jsonOptions));
}

// ==========================================
// 3. نقاط اتصال السيرفر (API Endpoints)
// ==========================================

// أ) جلب كل بيانات الموقع
app.MapGet("/api/data", () =>
{
    var db = LoadDb();
    return Results.Ok(new
    {
        fabrics = db.Fabrics,
        machines = db.Machines,
        batches = db.Batches,
        orders = db.Orders,
        customers = db.Customers
    });
});

// ب) دخول لوحة تحكم الإدارة
app.MapPost("/api/login", (LoginReq req) =>
{
    var db = LoadDb();
    if (req.Password == db.AdminPassword)
        return Results.Ok(new { success = true });

    return Results.Unauthorized();
});

// ج) تحديث أسعار الأقمشة
app.MapPost("/api/fabrics", (List<JsonElement> fabrics) =>
{
    var db = LoadDb();
    db.Fabrics = fabrics;
    SaveDb(db);
    return Results.Ok(new { message = "تم حفظ أسعار الأقمشة" });
});

// د) تحديث الماكينات
app.MapPost("/api/machines", (List<JsonElement> machines) =>
{
    var db = LoadDb();
    db.Machines = machines;
    SaveDb(db);
    return Results.Ok(new { message = "تم حفظ الماكينات" });
});

// هـ) تحديث مراحل التشغيلات
app.MapPost("/api/batches", (Dictionary<string, JsonElement> batches) =>
{
    var db = LoadDb();
    db.Batches = batches;
    SaveDb(db);
    return Results.Ok(new { message = "تم حفظ التشغيلات" });
});

// و) تغيير باسورد الإدارة
app.MapPost("/api/password", (LoginReq req) =>
{
    var db = LoadDb();
    db.AdminPassword = req.Password;
    SaveDb(db);
    return Results.Ok(new { message = "تم تحديث كلمة المرور" });
});

// ز) حفظ طلب شراء أو حجز ماكينة جديد
app.MapPost("/api/orders", (JsonElement newOrder) =>
{
    var db = LoadDb();
    db.Orders.Insert(0, newOrder);
    SaveDb(db);
    return Results.Ok(new { message = "تم حفظ الطلب" });
});

// ح) إنشاء حساب عميل جديد وحفظه في السيرفر
app.MapPost("/api/customers/register", (CustomerAccount c) =>
{
    if (string.IsNullOrWhiteSpace(c.Email) || string.IsNullOrWhiteSpace(c.Password))
        return Results.BadRequest(new { message = "يرجى إدخال البريد الإلكتروني وكلمة المرور" });

    var db = LoadDb();
    string cleanEmail = c.Email.Trim().ToLower();

    // التأكد هل الإيميل موجود فعلاً من قبل أم لا
    bool exists = db.Customers.Any(x => !string.IsNullOrWhiteSpace(x.Email) && x.Email.Trim().ToLower() == cleanEmail);
    if (exists)
        return Results.Conflict(new { message = "البريد الإلكتروني مسجل مسبقاً، يرجى تسجيل الدخول" });

    c.Email = cleanEmail;
    db.Customers.Add(c);
    SaveDb(db);

    return Results.Ok(new { success = true, customer = c });
});

// ط) تسجيل دخول العميل
app.MapPost("/api/customers/login", (CustomerLoginReq req) =>
{
    var db = LoadDb();
    string cleanEmail = (req.Email ?? "").Trim().ToLower();

    var customer = db.Customers.FirstOrDefault(x =>
        !string.IsNullOrWhiteSpace(x.Email) &&
        x.Email.Trim().ToLower() == cleanEmail &&
        x.Password == req.Password);

    if (customer != null)
        return Results.Ok(new { success = true, customer });

    return Results.Unauthorized();
});

app.Run();

// ==========================================
// 4. كلاسات قاعدة البيانات (Models)
// ==========================================
public record LoginReq(string Password);
public record CustomerLoginReq(string Email, string Password);

public class CustomerAccount
{
    public string Name { get; set; } = "";
    public string Email { get; set; } = "";
    public string Phone { get; set; } = "";
    public string Address { get; set; } = "";
    public string Company { get; set; } = "";
    public string Password { get; set; } = "";
}

public class AppDatabase
{
    public string AdminPassword { get; set; } = "2005";
    public List<JsonElement> Fabrics { get; set; } = new();
    public List<JsonElement> Machines { get; set; } = new();
    public Dictionary<string, JsonElement> Batches { get; set; } = new();
    public List<JsonElement> Orders { get; set; } = new();
    public List<CustomerAccount> Customers { get; set; } = new();
}