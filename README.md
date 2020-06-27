# Slot Booking Assistant
Class Booking Assistant is a full-fledged online event booking system that
enables the website users to book Classrooms, Auditoriums and Conference Rooms at
particular timeslots for their events or lectures. It has simple user interface and
administration page that gives user(faculty/Clubs) ability to send a request containing
details of their event to the Admin. Admin has the authority to accept/deny the events
according to the preference. It also contains Calendar integration to display the
accepted events and to show whether the slot and classroom is occupied or not. History
of all the Accepted/Denied events are maintained and it is searchable. Admin also has
the authority to deregister existing users and register New Users.

**Frameworks:**<br>
The MEAN–stack frameworks are used in this website. They are as follows:-
- Database: Mongoose,
- Front-end: Angular/HTML/CSS,
- Back-end: NodeJS, Express
There are two Schemas for Users and Events. The front-end is in Angular
(Typescript) and Bootstrap. The back-end is in NodeJS connected with mongoose and
the routes contain APIs with express.

**Feature Details:**<br/>
1. Login/Logout:
>- This page asks for email, password and role of the user. Then it generates
the JWT (JsonWebToken) for Authorization. And then directing it to the
Event Calendar page. 
2. Schedule:
>- Basically, it displays the Calendar with Resource (Classrooms) and Time
Grid. It contains only the accepted Events.
>- At the bottom, Book Event executes and user can send a request with
their Event details to the Admin. Before sending the request, it has Date
and Time Validation along with clashes of the event with the Accepted
ones.
3. Request (Admin):
>- All the pending requests are handled here by the Admin. From the view
icon he can view all the event details and can accept/deny the event along
with sending a Note to the User. Particular request can be searched by
date, classroom and tittle as well.
4. Profile:
>- It displays the profile of the user. The Email address, Name and Role. It
also gives an option to change password by the user.
5. History:
>- History shows all the Accepted/Denied events to the Admin but it only
shows the other users their own events. It is searchable and user can view
all the details of their own event as well as delete it.
6. Users (Admin):
>- This page is for Admin only. He can register new users (Faculty/Clubs)
and can deregister them as well. He can view all the user's profile except
their password.<br/>

**Hope you like it!! Thank you!!:)**
