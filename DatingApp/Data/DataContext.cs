using DatingApp.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.Data
{
  public class DataContext : IdentityDbContext<AppUser, AppRole, int, 
        IdentityUserClaim<int>, AppUserRole, IdentityUserLogin<int>, 
        IdentityRoleClaim<int>, IdentityUserToken<int>>
  {
    public DbSet<Photo> Photos { get; set; }
    public DbSet<UserLike> Likes { get; set; }
    public DbSet<Message> Messages { get; set; }
    public DataContext(DbContextOptions<DataContext> options) : base(options) { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<AppUser>()
        .HasMany(ur => ur.UserRoles)
        .WithOne(u => u.User)
        .HasForeignKey(ur => ur.UserId)
        .IsRequired();

      modelBuilder.Entity<AppRole>()
          .HasMany(ur => ur.UserRoles)
          .WithOne(u => u.Role)
          .HasForeignKey(ur => ur.RoleId)
          .IsRequired();


      modelBuilder.Entity<UserLike>()
          .HasKey(k => new { k.SourceUserId, k.LikedUserId });
      modelBuilder.Entity<UserLike>()
          .HasOne(l => l.SourceUser)
          .WithMany(l => l.LikedUsers)
          .HasForeignKey(l => l.SourceUserId)
          .OnDelete(DeleteBehavior.Restrict);

      modelBuilder.Entity<UserLike>()
          .HasOne(l => l.LikedUser)
          .WithMany(l => l.LikedByUsers)
          .HasForeignKey(l => l.LikedUserId)
          .OnDelete(DeleteBehavior.Restrict);


      modelBuilder.Entity<Message>()
         .HasOne(u => u.Recipient)
         .WithMany(m => m.MessagesReceived)
         .OnDelete(DeleteBehavior.Restrict);

      modelBuilder.Entity<Message>()
          .HasOne(u => u.Sender)
          .WithMany(m => m.MessagesSent)
          .OnDelete(DeleteBehavior.Restrict);
    }
  }
}