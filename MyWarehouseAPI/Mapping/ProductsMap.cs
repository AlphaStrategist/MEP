using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MyWarehouseAPI.Models;

namespace MyWarehouseAPI.Mappings
{
    public class ProductsMap : IEntityTypeConfiguration<Product>
    {
        public void Configure(EntityTypeBuilder<Product> builder)
        {
            builder.ToTable("products");

            builder.HasKey(p => p.Id)
                   .HasName("products_pkey");

            builder.Property(p => p.Id)
                   .HasColumnName("id")
                   .ValueGeneratedOnAdd();

            builder.Property(p => p.ProductName)
                   .HasColumnName("productName")
                   .HasColumnType("character varying(255)")
                   .IsRequired();

            builder.Property(p => p.Category)
                   .HasColumnName("category")
                   .HasColumnType("character varying(100)")
                   .IsRequired();

            builder.Property(p => p.Quantity)
                   .HasColumnName("quantity")
                   .IsRequired();

            builder.Property(p => p.CreatedOn)
                   .HasColumnName("createdOn")
                   .HasColumnType("timestamp with time zone")
                   .HasDefaultValueSql("CURRENT_TIMESTAMP")
                   .IsRequired();

            builder.Property(p => p.UpdatedOn)
                   .HasColumnName("updatedOn")
                   .HasColumnType("timestamp with time zone")
                   .HasDefaultValueSql("CURRENT_TIMESTAMP")
                   .IsRequired();

            builder.Property(p => p.CreatedBy)
                   .HasColumnName("createdBy")
                   .IsRequired(false);

            builder.HasOne(p => p.Creator)
                    .WithMany()
                    .HasForeignKey(p => p.CreatedBy)
                    .HasConstraintName("products_createdBy_fkey")
                    .OnDelete(DeleteBehavior.NoAction);
        }
    }
}
