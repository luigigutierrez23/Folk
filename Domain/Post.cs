using System;
using System.Collections.Generic;

namespace Domain
{
    public class Post
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }
        public DateTime Date { get; set; }
        public string City { get; set; }
        public string Venue { get; set; } 
        public bool IsCancelled { get; set; }
        public ICollection<PostsAttendee> Attendees { get; set; } = new List<PostsAttendee>();
        public ICollection<Comment> Comments { get; set; } = new List<Comment>();
    }
}