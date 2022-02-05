using DatingApp.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.Data
{
    public class DataContext : DbContext
    {
        public DbSet<AppUser> AppUsers { get; set; }
        public DbSet<Photo> Photos { get; set; }
        public DbSet<UserLike> Likes { get; set; }
        public DataContext(DbContextOptions<DataContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
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
        }
    }
}