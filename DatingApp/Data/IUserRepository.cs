using System.Collections.Generic;
using System.Threading.Tasks;
using DatingApp.Models;

namespace DatingApp.Data
{
    public interface IUserRepository: IGenericRepository<User>
    {
         Task <IEnumerable<User>> GetUsers();
         Task<User> GetUserById(int id);
         Task<bool> SaveAll();
    }
}