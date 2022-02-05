using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using DatingApp.Data;
using DatingApp.Dtos;
using DatingApp.Helper;
using DatingApp.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.Interfaces
{
    public class UserService : BaseService<AppUser>, IUserService
    {
        private readonly IMapper _mapper;

        public UserService(DataContext context, IMapper mapper) : base(context)
        {
            _mapper = mapper;

        }

        public void Add<Like>(Like entity)
        {
            _context.Add(entity);
        }

        // Safe=> removed
        public void DeletePhoto(Photo photo)
        {
            _context.Remove(photo);
        }

        public async Task<Like> GetLike(int userId, int recipientId)
        {
            return await _context.Likes.FirstOrDefaultAsync(u => u.LikerId == userId && u.LikeeId == recipientId);
        }

        public async Task<Photo> GetMainPhoto(int userId)
        {
            return await _context.Photos.Where(u => u.UserId == userId).FirstOrDefaultAsync(p => p.IsMain);
        }

        public async Task<Photo> GetPhoto(int id)
        {
            var photo = await _context.Photos.FirstOrDefaultAsync(p => p.Id == id);
            return photo;
        }

        public async Task<AppUser> GetUserById(int id)
        {
            var user = await _context.AppUsers.Include(p => p.Photos).FirstOrDefaultAsync(u => u.Id == id);
            return user;
        }

        public async Task<PageList<AppUser>> GetUsers(UserParams userParams)
        {
            var users = _context.AppUsers.Include(p => p.Photos).OrderByDescending(u => u.LastActive).AsQueryable();
            users = users.Where(u => u.Id != userParams.UserId);
            users = users.Where(u => u.Gender == userParams.Gender);
            if (userParams.Likers)
            {
                //this will return current 
                var userLikers = await GetUserLikes(userParams.UserId, userParams.Likers);
                users = users.Where(u => userLikers.Contains(u.Id));
            }
            if (userParams.Likees)
            {
                //here use the same userParams.Likers because we check likers true or false
                var userLikees = await GetUserLikes(userParams.UserId, userParams.Likers);
                users = users.Where(u => userLikees.Contains(u.Id));
            }


            if (userParams.MinAge != 18 && userParams.MaxAge != 90)
            {
                var minDOB = DateTime.Today.AddYears(-userParams.MaxAge - 1);
                var maxDOB = DateTime.Today.AddYears(-userParams.MinAge);
                users = users.Where(u => u.DateOfBirth >= minDOB && u.DateOfBirth <= maxDOB);
            }
            if (!string.IsNullOrEmpty(userParams.OrderBy))
            {
                switch (userParams.OrderBy)
                {
                    case "created":
                        {
                            users = users.OrderByDescending(u => u.Created);
                            break;
                        }
                    default:
                        users = users.OrderByDescending(u => u.LastActive);
                        break;
                }
            }

            return await PageList<AppUser>.CreateAsync(users, userParams.PageNumber, userParams.PageSize);
        }

        private async Task<IEnumerable<int>> GetUserLikes(int id, bool likers)
        {
            //find  the login user whom he liked or who is being liked by other user
            var user = await _context.AppUsers
            .Include(l => l.Likers)
            .Include(l => l.Likees)
            .FirstOrDefaultAsync(u => u.Id == id);
            if (likers)
            {
                //return a list of likers who liked currently login user
                return user.Likers.Where(u => u.LikeeId == id).Select(i => i.LikerId);
            }
            else
            {
                //return a list of likees of the current login user 
                return user.Likees.Where(u => u.LikerId == id).Select(i => i.LikeeId);
            }
        }

        public async Task<bool> SaveAll()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<AppUser> GetUserByUserName(string userName)
        {
            return await _context.AppUsers
                 .Where(x => x.UserName == userName)
                 .ProjectTo<AppUser>(_mapper.ConfigurationProvider)
                 .SingleOrDefaultAsync();
        }

        public async Task<IEnumerable<AppUser>> GetUsersAsync()
        {
            return await _context.AppUsers
                .Include(p => p.Photos)
                .ToListAsync();
        }

        public async Task<AppUser> GetUserByIdAsync(int id)
        {
            return await _context.AppUsers.FindAsync(id);
        }

        public async Task<AppUser> GetUserByUsernameAsync(string username)
        {
            return await _context.AppUsers
               .Include(p => p.Photos)
               .SingleOrDefaultAsync(x => x.UserName == username);
        }

        public async Task<PageList<MemberDto>> GetMembersAsync(UserParams userParams)
        {
            var query = _context.AppUsers.AsQueryable();

            query = query.Where(u => u.UserName != userParams.CurrentUsername);
            query = query.Where(u => u.Gender.ToLower() == userParams.Gender.ToLower());

            var minDob = DateTime.Today.AddYears(-userParams.MaxAge - 1);
            var maxDob = DateTime.Today.AddYears(-userParams.MinAge);

            query = query.Where(u => u.DateOfBirth >= minDob && u.DateOfBirth <= maxDob);

            query = userParams.OrderBy switch
            {
                "created" => query.OrderByDescending(u => u.Created),
                _ => query.OrderByDescending(u => u.LastActive)
            };

            return await PageList<MemberDto>.CreateAsync(query.ProjectTo<MemberDto>(_mapper
                .ConfigurationProvider).AsNoTracking(),
                    userParams.PageNumber, userParams.PageSize);
        }

        public async Task<MemberDto> GetMemberAsync(string username)
        {
            return await _context.AppUsers
                .Where(x => x.UserName == username)
                .ProjectTo<MemberDto>(_mapper.ConfigurationProvider)
                .SingleOrDefaultAsync();
        }

        public async Task<string> GetUserGender(string username)
        {
            return await _context.AppUsers
               .Where(x => x.UserName == username)
               .Select(x => x.Gender).FirstOrDefaultAsync();
        }

        public void Update(AppUser user)
        {
            _context.Entry(user).State = EntityState.Modified;
        }

        public async Task<Pagination<MemberDto>> GetUsersWithPaginationAsync(UserParams userParams)
        {
            var query = _context.AppUsers.AsQueryable();

            query = query.Where(u => u.UserName != userParams.CurrentUsername);
            query = query.Where(u => u.Gender.ToLower() == userParams.Gender.ToLower());

            var minDob = DateTime.Today.AddYears(-userParams.MaxAge - 1);
            var maxDob = DateTime.Today.AddYears(-userParams.MinAge);

            query = query.Where(u => u.DateOfBirth >= minDob && u.DateOfBirth <= maxDob);

            query = userParams.OrderBy switch
            {
                "created" => query.OrderByDescending(u => u.Created),
                _ => query.OrderByDescending(u => u.LastActive)
            };
            var data = query.ProjectTo<MemberDto>(_mapper
                            .ConfigurationProvider).AsNoTracking();
            var count = await _context.AppUsers.CountAsync();
            return new Pagination<MemberDto>(
                    userParams.PageNumber, userParams.PageSize, count, data);
        }
    }
}