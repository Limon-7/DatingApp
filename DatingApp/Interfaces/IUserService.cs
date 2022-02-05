using System.Collections.Generic;
using System.Threading.Tasks;
using DatingApp.Dtos;
using DatingApp.Helper;
using DatingApp.Models;

namespace DatingApp.Interfaces
{
    public interface IUserService : IBaseService<AppUser>
    {
        void Update(AppUser user);
        Task<IEnumerable<AppUser>> GetUsersAsync();
        Task<AppUser> GetUserByIdAsync(int id);
        Task<AppUser> GetUserByUsernameAsync(string username);
        Task<PageList<MemberDto>> GetMembersAsync(UserParams userParams);
        Task<Pagination<MemberDto>> GetUsersWithPaginationAsync(UserParams userParams);

        Task<MemberDto> GetMemberAsync(string username);
        Task<string> GetUserGender(string username);



        Task<PageList<AppUser>> GetUsers(UserParams userParams);
        Task<AppUser> GetUserById(int id);
        Task<AppUser> GetUserByUserName(string userName);


        Task<bool> SaveAll();
        Task<Photo> GetPhoto(int id);
        Task<Photo> GetMainPhoto(int userId);
        public void DeletePhoto(Photo photo);
        Task<Like> GetLike(int userId, int recipientId);
        void Add<Like>(Like entity);
    }
}