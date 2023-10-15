using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace FalconPay.Web.DB;

public partial class DevkodContext : DbContext
{
    public DevkodContext()
    {
    }

    public DevkodContext(DbContextOptions<DevkodContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Payment> Payments { get; set; }

    public virtual DbSet<SplToken> SplTokens { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseSqlServer("Name=ConnectionStrings:dbb");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasDefaultSchema("devkod");

        modelBuilder.Entity<Payment>(entity =>
        {
            entity.ToTable("Payments", "dbo");

            entity.Property(e => e.Link).HasMaxLength(500);
            entity.Property(e => e.RecieverWallet).HasMaxLength(150);
            entity.Property(e => e.RequestedAmount).HasMaxLength(25);
            entity.Property(e => e.SenderWallet).HasMaxLength(150);

            entity.HasOne(d => d.SplToken).WithMany(p => p.Payments)
                .HasForeignKey(d => d.SplTokenId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Payments_SplTokens");
        });

        modelBuilder.Entity<SplToken>(entity =>
        {
            entity.ToTable("SplTokens", "dbo");

            entity.Property(e => e.TokenAddress).HasMaxLength(150);
            entity.Property(e => e.TokenName).HasMaxLength(150);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
