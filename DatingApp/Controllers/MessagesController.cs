using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.Dtos;
using DatingApp.Extentions;
using DatingApp.Helper;
using DatingApp.Interfaces;
using DatingApp.Models;
using Microsoft.AspNetCore.Mvc;

namespace DatingApp.Controllers
{

    public class MessagesController : BaseController
    {
        private readonly IMessageService _service;
        private readonly IUserService _userService;
        private readonly IMapper _mapper;
        public MessagesController(IMessageService service, IUserService userService, IMapper mapper)
        {
            _mapper = mapper;
            _userService = userService;
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MessageDto>>> GetMessagesForUser([FromQuery]
            MessageParams messageParams)
        {
            messageParams.Username = User.GetUsername();

            var messages = await _service.GetMessagesForUser(messageParams);

            Response.AddPagination(messages.CurrentPage, messages.PageSize,
                messages.TotalCount, messages.TotalPage);

            return messages;
        }

        [HttpGet("thread/{username}")]
        public async Task<ActionResult<IEnumerable<MessageDto>>> GetMessageThread([FromQuery]
            string username)
        {
            var currentUsername = User.GetUsername();

            var messages = await _service.GetMessageThread(currentUsername, username);
            return Ok(messages);
        }

        [HttpPost]
        public async Task<ActionResult<MessageDto>> CreateMessageAsync(CreateMessageDto dto)
        {
            var username = User.GetUsername();
            if (username == dto.RecipientUsername) return BadRequest("You can send you message yourself");

            var sender = await _userService.GetUserByUsernameAsync(username);
            var recipient = await _userService.GetUserByUsernameAsync(dto.RecipientUsername);

            if (recipient == null) return NotFound();

            var message = new Message
            {
                Sender = sender,
                Recipient = recipient,
                SenderUsername = sender.UserName,
                RecipientUsername = recipient.UserName,
                Content = dto.Content
            };

            _service.AddMessage(message);
            if (await _service.SaveAllAsync()) return Ok(_mapper.Map<MessageDto>(message));

            return BadRequest("Failed to send message");
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteMessage(int id)
        {
            var username = User.GetUsername();

            var message = await _service.GetMessage(id);

            if (message.Sender.UserName != username && message.Recipient.UserName != username)
                return Unauthorized();

            if (message.Sender.UserName == username) message.SenderDeleted = true;

            if (message.Recipient.UserName == username) message.RecipientDeleted = true;

            if (message.SenderDeleted && message.RecipientDeleted)
                _service.DeleteMessage(message);

            if (await _service.SaveAllAsync()) return Ok();

            return BadRequest("Problem deleting the message");
        }
    }
}
