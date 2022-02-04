using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.Data;
using DatingApp.Dtos;
using DatingApp.Extentions;
using DatingApp.Interfaces;
using DatingApp.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DatingApp.Controllers
{
    [Authorize]
    public class PhotosController : BaseController
    {
        private readonly IUserRepository _userRepo;
        private readonly IMapper _imapper;
        private readonly IPhotoService _service;

        public PhotosController(IUserRepository userRepo, IMapper imapper, IPhotoService service)
        {
            _userRepo = userRepo;
            _imapper = imapper;
            _service = service;
        }

		[HttpGet("{id}", Name = "GetPhoto")]
		public async Task<IActionResult> GetPhotoById(int id)
		{
			var photoFromRepo = await _userRepo.GetPhoto(id);
			var photo = _imapper.Map<PhotoDto>(photoFromRepo);
			return Ok(photo);
		}


		[HttpPost]
        public async Task<ActionResult<PhotoDto>> AddPhoto([FromForm] IFormFile file)
        {
            var user = await _userRepo.GetUserByUsernameAsync(User.GetUsername());
            if(user==null)return Unauthorized();
            
           var result = await _service.AddPhotoAsync(file);
           if (result.Error != null) return BadRequest(result.Error.Message);
            var photo = new Photo
            {
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId
            };

            if (user.Photos.Count == 0)
            {
                photo.IsMain = true;
            }

            user.Photos.Add(photo);

            
            if (await _userRepo.SaveAll())
            {
                return Ok(_imapper.Map<PhotoDto>(photo));
            }
            return BadRequest("Photos not found");
        }

        [HttpPut("set-main-photo/{photoId}")]
        public async Task<ActionResult> SetMainPhoto(int photoId)
        {
            var user = await _userRepo.GetUserByUsernameAsync(User.GetUsername());

            var photo = user.Photos.FirstOrDefault(x => x.Id == photoId);

            if (photo.IsMain) return BadRequest("This is already your main photo");

            var currentMain = user.Photos.FirstOrDefault(x => x.IsMain);
            if (currentMain != null) currentMain.IsMain = false;
            photo.IsMain = true;

            if (await _userRepo.SaveAll()) return NoContent();

            return BadRequest("Failed to set main photo");
        }

        [HttpDelete("{photoId}")]
        public async Task<ActionResult> DeletePhoto(int photoId)
        {
            var user = await _userRepo.GetUserByUsernameAsync(User.GetUsername());

            var photo = user.Photos.FirstOrDefault(x => x.Id == photoId);

            if (photo == null) return NotFound();

            if (photo.IsMain) return BadRequest("You cannot delete your main photo");

            if (photo.PublicId != null)
            {
                var result = await _service.DeletePhotoAsync(photo.PublicId);
                if (result.Error != null) return BadRequest(result.Error.Message);
            }

            user.Photos.Remove(photo);

            if (await _userRepo.SaveAll()) return Ok();

            return BadRequest("Failed to delete the photo");
        }
    }
}