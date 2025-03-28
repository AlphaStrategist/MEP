using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MyWarehouseAPI.Models;

namespace MyWarehouseAPI.Mappings
{
    public class RefreshTokenMap : IEntityTypeConfiguration<RefreshToken>
    {
        public void Configure(EntityTypeBuilder<RefreshToken> builder)
        {
            builder.ToTable("refresh_tokens");

            builder.HasKey(rt => rt.Id)
                   .HasName("refresh_tokens_pkey");

            builder.Property(rt => rt.Id)
                   .HasColumnName("id")
                   .ValueGeneratedOnAdd();

            builder.Property(rt => rt.UserId)
                   .HasColumnName("user_id")
                   .IsRequired();

            builder.Property(rt => rt.Token)
                   .HasColumnName("token")
                   .HasColumnType("character varying(255)")
                   .IsRequired();

            builder.Property(rt => rt.ExpiresOn)
                   .HasColumnName("expires_on")
                   .HasColumnType("timestamp with time zone")
                   .IsRequired();

            builder.Property(rt => rt.RevokedOn)
                   .HasColumnName("revoked_on")
                   .HasColumnType("timestamp with time zone")
                   .IsRequired(false);

            builder.Property(rt => rt.CreatedOn)
                   .HasColumnName("created_on")
                   .HasColumnType("timestamp with time zone")
                   .HasDefaultValueSql("CURRENT_TIMESTAMP")
                   .IsRequired();

            builder.HasOne(rt => rt.User)
                   .WithMany()
                   .HasForeignKey(rt => rt.UserId)
                   .HasConstraintName("refresh_tokens_user_fk")
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
