using System;
using System.Threading.Tasks;
using Application.Posts;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class PostsController : BaseApiController
    {
        [HttpGet]
        public async Task<IActionResult> GetPosts([FromQuery]PostParams param)
        {
            return HandlePagedResult(await Mediator.Send(new List.Query{Params = param}));
        }

        [HttpGet("{id}")] 
        public async Task<ActionResult<Post>> GetPost(Guid id)
        {        
            return HandleResult(await Mediator.Send(new Details.Query{Id = id}));
        }

        [HttpPost]
        public async Task<IActionResult> Create(Post post)
        {
            return HandleResult(await Mediator.Send(new Create.Command { Post = post }));
        }

        [Authorize(Policy = "IsPostHost")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Edit(Guid id, Post post)
        {
            post.Id = id;
            return HandleResult(await Mediator.Send(new Edit.Command { Post = post }));
        }

        [Authorize(Policy = "IsPostHost")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            return HandleResult(await Mediator.Send(new Delete.Command{Id = id}));
        }

        [HttpPost("{id}/attend")]
        public async Task<IActionResult> Attend(Guid id)
        {
            return HandleResult(await Mediator.Send(new UpdateAttendance.Command{Id = id}));
        }
    }
}