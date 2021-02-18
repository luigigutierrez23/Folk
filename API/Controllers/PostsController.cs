using System;
using System.Threading.Tasks;
using Application.Posts;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostsController : BaseApiController
    {
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetPosts()
        {
            return HandleResult(await Mediator.Send(new List.Query()));
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        // [Authorize]
        public async Task<ActionResult<Post>> GetPost(Guid id)
        {        
            return HandleResult(await Mediator.Send(new Details.Query{Id = id}));
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> Create(Post post)
        {
            return HandleResult(await Mediator.Send(new Create.Command { Post = post }));
        }

        [HttpPut("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> Edit(Guid id, Post post)
        {
            post.Id = id;
            return HandleResult(await Mediator.Send(new Edit.Command { Post = post }));
        }

        [HttpDelete("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> Delete(Guid id)
        {
            return HandleResult(await Mediator.Send(new Delete.Command{Id = id}));
        }
    }
}