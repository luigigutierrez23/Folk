using System;
using System.Threading.Tasks;
using Application.Comments;
using MediatR;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
    public class ChatHub : Hub
    {
        private readonly IMediator _mediator;
        public ChatHub(IMediator mediator)
        {
            _mediator = mediator;
        }

        public async Task SendComment(Create.Command command)
        {
            var comment = await _mediator.Send(command);

            await Clients.Group(command.PostId.ToString())
                .SendAsync("ReceiveComment", comment.Value);
        }

        public override async Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();
            var postId = httpContext.Request.Query["postId"];
            await Groups.AddToGroupAsync(Context.ConnectionId, postId);
            var result = await _mediator.Send(new List.Query{PostId = Guid.Parse(postId)});
            await Clients.Caller.SendAsync("LoadComments", result.Value);
        }
    }
}