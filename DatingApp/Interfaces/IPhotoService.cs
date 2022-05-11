using System.Threading.Tasks;
using CloudinaryDotNet.Actions;
using DatingApp.Models;
using Microsoft.AspNetCore.Http;

namespace DatingApp.Interfaces
{
    public interface IPhotoService
    {
        Task<ImageUploadResult> AddPhotoAsync(IFormFile file);
        Task<DeletionResult> DeletePhotoAsync(string publicId);
    }
}