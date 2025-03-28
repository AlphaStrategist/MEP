using DotNetEnv;
using Microsoft.EntityFrameworkCore;
using MyWarehouseAPI.Data;

var builder = WebApplication.CreateBuilder(args);

Env.Load();

var dbHost = Environment.GetEnvironmentVariable("DB_HOST");
var dbPort = Environment.GetEnvironmentVariable("DB_PORT");
var dbName = Environment.GetEnvironmentVariable("DB_NAME");
var dbUser = Environment.GetEnvironmentVariable("DB_USER");
var dbPassword = Environment.GetEnvironmentVariable("DB_PASSWORD");

var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
var urls = Environment.GetEnvironmentVariable("ASPNETCORE_URLS");

if (!string.IsNullOrEmpty(urls))
{
    builder.WebHost.UseUrls(urls);
}

if (!string.IsNullOrEmpty(environment))
{
    builder.Environment.EnvironmentName = environment;
}

if ((dbHost == null) || (dbPort == null) || (dbName == null) || (dbUser == null) || (dbPassword == null))
    throw new Exception("Environmental variables could not be found.");

var connectionString = $"Host={dbHost};Port={dbPort};Database={dbName};Username={dbUser};Password={dbPassword}";

builder.Services.AddDbContext<AppDbContext>(options => options.UseNpgsql(connectionString));

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularLocalhost", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAngularLocalhost");
app.UseRouting();
app.MapControllers();
app.Run();
