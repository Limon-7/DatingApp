using DatingApp.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.Data
{
    public class DataContext: DbContext
    {
        public DbSet<Value> Values { get; set; }
        public DataContext(DbContextOptions<DataContext> options):base (options)  {} 
    }
} 