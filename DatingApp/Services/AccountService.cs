using System.Security.Cryptography;
using System.Threading.Tasks;
using DatingApp.Data;
using DatingApp.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.Interfaces
{
    public class AccountService : BaseService<AppUser>, IAccountService
    {

        public AccountService(DataContext context) : base(context)
        {
        }
        public async Task<AppUser> Login(string userName, string password)
        {
            var user = await _context.AppUsers.Include(p => p.Photos).FirstOrDefaultAsync(x => x.UserName.ToLower() == userName.ToLower());
            if (user == null)
            {
                return null;
            }
            if (!VarifiedPassword(password, user.PasswordHash, user.PasswordSalt))
            {
                return null;
            }
            return user;
        }

        private bool VarifiedPassword(string password, byte[] passwordHash, byte[] passwordSalt)
        {
            using (var hmc = new HMACSHA512(passwordSalt))
            {
                var computedHash = hmc.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                for (int i = 0; i < computedHash.Length; i++)
                {
                    if (computedHash[i] != passwordHash[i])
                        return false;
                }
            }
            return true;
        }

        public async Task<AppUser> Register(AppUser user, string password)
        {
            byte[] passwordHash, passwordSalt;
            // CreatePasswordHas(password,  out  passwordhash, passwordsalt);
            using (var hmc = new HMACSHA512())
            {
                passwordHash = hmc.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                passwordSalt = hmc.Key;
            }
            user.PasswordHash = passwordHash;
            user.PasswordSalt = passwordSalt;

            await _context.AddAsync(user);
            await _context.SaveChangesAsync();
            return user;

        }

        public async Task<bool> UserExists(string userName)
        {
            if (await _context.AppUsers.AnyAsync(x => x.UserName == userName))
            {
                return true;
            }
            return false;
        }
        public async Task<AppUser> UserAlreadyExists(string userName)
        {
            var user = await _context.AppUsers.FirstOrDefaultAsync(x => x.UserName == userName);
            return user;

        }
    }
}