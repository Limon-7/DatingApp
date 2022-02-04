using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using DatingApp.Models;
using Newtonsoft.Json;

namespace DatingApp.Data
{
    public class Seed
    {
        private readonly DataContext _context;

        public Seed(DataContext context)
        {
            _context = context;
        }
        public void SeedUsers()
        {
            var userData = System.IO.File.ReadAllText("Data/UserSeedData.json");
            var users = JsonConvert.DeserializeObject<List<AppUser>>(userData);
            foreach (var user in users)
            {
                byte[] passwordHash, passwordSalt;
                cretePassword("password", out passwordHash, out passwordSalt);
                user.PasswordHash = passwordHash;
                user.PasswordSalt = passwordSalt;
                user.UserName = user.UserName.ToLower();
                _context.AppUsers.Add(user);
            }
            _context.SaveChanges();
        }

        private void cretePassword(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmc = new HMACSHA512())
            {
                passwordHash = hmc.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                passwordSalt = hmc.Key;
            }
        }
    }
}