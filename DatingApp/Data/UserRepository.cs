using System.Collections.Generic;
using System.Threading.Tasks;
using DatingApp.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.Data
{
    public class UserRepository : GenericRepository<User>, IUserRepository
    {
        public UserRepository(DataContext context):base(context)
        {
            
        }

        public async Task<User> GetUserById(int id)
        {
            var user =await  _context.Users.Include(p=>p.Photos).FirstOrDefaultAsync(u=>u.Id==id);
            return user;
        }

        public async Task<IEnumerable<User>> GetUsers()
        {
            var user= await _context.Users.Include(p=>p.Photos).ToListAsync();
            return user;
        }

       public async Task<bool> SaveAll(){
           return await _context.SaveChangesAsync()>0;
        }
    }
}