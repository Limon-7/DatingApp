using System;
using System.Linq;
using System.Security.Cryptography;
using System.Threading.Tasks;
using DatingApp.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.Data
{
    public class AuthRepository : GenericRepository<User>,IAuthRepository
    {
        // private readonly DataContext _context;

        public AuthRepository(DataContext context):base(context)
        {
            // _context = context;
        }
        public async Task<User> Login(string userName, string password)
        {
           var user= await _context.Users.FirstOrDefaultAsync(x=>x.UserName==userName);
           if(user==null){
               return null;
           }
           if(!VarifiedPassword(password,user.PasswordHash,user.PasswordSalt)){
               return null;
           }
           return user;
        }

        private bool VarifiedPassword(string password, byte[] passwordHash, byte[] passwordSalt)
        {
            using( var hmc= new HMACSHA512(passwordSalt)){
                var computedHash=hmc.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                for(int i=0; i<computedHash.Length;i++){
                    if(computedHash[i]!=passwordHash[i])
                    return false;
                }
            }
            return true;
        }

        public async Task<User> Register(User user, string password)
        {
            byte[] passwordHash,passwordSalt;
            // CreatePasswordHas(password,  out  passwordhash, passwordsalt);
            using( var hmc= new HMACSHA512()){
                passwordHash=hmc.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                passwordSalt=hmc.Key;
            }
            user.PasswordHash=passwordHash;
            user.PasswordSalt=passwordSalt;
           
            await _context.AddAsync(user);
            await _context.SaveChangesAsync();
            return user;

        }

        public async Task<bool> UserExists(string userName)
        {
            if (await _context.Users.AnyAsync(x=>x.UserName==userName))
            {
                return true;
            }
            return false;
        }
    }
}