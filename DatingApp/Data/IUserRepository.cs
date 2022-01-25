using System.Collections.Generic;
using System.Threading.Tasks;
using DatingApp.Dtos;
using DatingApp.Helper;
using DatingApp.Models;

namespace DatingApp.Data
{
    public interface IUserRepository : IGenericRepository<User>
    {
        Task<PageList<User>> GetUsers(UserParams userParams);
        Task<User> GetUserById(int id);

        Task<MemberDto> GetUserByUserName(string userName);
        Task<bool> SaveAll();
        Task<Photo> GetPhoto(int id);
        Task<Photo> GetMainPhoto(int userId);
        public void DeletePhoto(Photo photo);
        Task<Like> GetLike(int userId, int recipientId);
        void Add<Like>(Like entity);
    }
}