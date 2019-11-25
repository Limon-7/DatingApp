using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.Data;
using DatingApp.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DatingApp.Controllers
{
     [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class UserController: Controller
    {
        private readonly IUserRepository _userRepo;
        private readonly IMapper _mapper;

        public UserController(IUserRepository userRepo, IMapper mapper)
        {
            _userRepo = userRepo;
            _mapper = mapper;
        }
        [HttpGet]
        public async Task<IActionResult> GetUsers(){
            var users= await _userRepo.GetUsers();
            var usersToReturn= _mapper.Map<IEnumerable<UserForListDto>>(users);
            return Ok(usersToReturn);
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(int id){
            var user= await _userRepo.GetUserById(id);
            var userToReturn= _mapper.Map<UserForDetailsDto>(user);
            return Ok(userToReturn);
        }
    }
}