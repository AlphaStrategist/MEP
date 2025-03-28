using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MyWarehouseAPI.Models;

namespace MyWarehouseAPI.Mappings
{
    public class UserMap : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.ToTable("users");

            builder.HasKey(u => u.Id)
                   .HasName("users_pkey");

            builder.Property(u => u.Id)
                   .HasColumnName("id")
                   .IsRequired()
                   .ValueGeneratedOnAdd();

            builder.Property(u => u.Name)
                   .HasColumnName("name")
                   .HasColumnType("character varying(100)")
                   .IsRequired();

            builder.Property(u => u.Email)
                   .HasColumnName("email")
                   .HasColumnType("character varying(255)")
                   .IsRequired();
            builder.HasIndex(u => u.Email)
                   .IsUnique()
                   .HasDatabaseName("users_email_key");

            builder.Property(u => u.Password)
                   .HasColumnName("password")
                   .HasColumnType("character varying(255)")
                   .IsRequired();

            builder.Property(u => u.Role)
                   .HasColumnName("role")
                   .HasColumnType("character varying(50)")
                   .IsRequired();

            builder.Property(u => u.Token)
                   .HasColumnName("token")
                   .HasColumnType("character varying(255)")
                   .IsRequired(false);

            builder.Property(u => u.TokenExpiry)
                   .HasColumnName("tokenExpiry")
                   .IsRequired(false);

            builder.Property(u => u.LastLogin)
                   .HasColumnName("lastLogin")
                   .IsRequired(false);

            builder.Property(u => u.CreatedOn)
                   .HasColumnName("createdOn")
                   .HasDefaultValueSql("CURRENT_TIMESTAMP")
                   .IsRequired();

            builder.Property(u => u.UpdatedOn)
                   .HasColumnName("updatedOn")
                   .HasDefaultValueSql("CURRENT_TIMESTAMP")
                   .IsRequired();
        }
    }
}
