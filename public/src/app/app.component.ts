import { Component } from '@angular/core';
import { NgwWowService } from 'ngx-wow';
import {ChatService} from './chat.service'

declare var $: any;
declare var counterUp: any;
declare var tinymce: any
// // declare var isotope: any

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers:[ChatService]
})
export class AppComponent  {
  title = 'public';
  status: boolean;
  user: any;
  code: any;
  answer: any;
  team_code: any;
  start_challenge_flag: boolean;
  join_challenge_flag: boolean;
  main_challenge_flag:boolean;
  windows_flag: boolean;
  view_team: boolean;
  header_flag: boolean;
  exit_flag: boolean;
  messageArray: Array<{user: String, message: String,time:any}> = [];
  messageText: String;
  usersArray: any;
  algorithm: string;
  algo_Challenge: string;
  fileData: File = null;
  winners: Array<{user: String}> = [];
  team_name:String
  

  constructor(private WOW: NgwWowService, private _chatService: ChatService){
   
    //display new message
    this._chatService.newMessageRecieved()
    .subscribe(data=>
      {
        var today = new Date();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        data.time = time;
      this.messageArray.push(data)
      }
      );

    //display new user 
    this._chatService.newTeamJoined()
    .subscribe(data=> this.usersArray = data.user)

    //show code of a specific team
    this._chatService.DocToShow()
    .subscribe(data=>{
      this.answer = data.record.document
      this.team_name = data.record.username
    })     

    //real time update
    this._chatService.DocUpdated()
    .subscribe(data=> { 
      this.answer = data['document']
    })

    this._chatService.colorChanged()
   .subscribe(data=> {
     console.log(data['data'])
     this.winners.push(data['data'])
     console.log("ww",this.winners)
     var i:any
     for ( i in this.winners) {
       if(i < 3){
     console.log(this.winners[i])
     $('#' +this.winners[i] ).css('background' , '#b6ecb6')
     var total = 1+ parseInt(i);
     $('#r' +this.winners[i]).html(total) }}
   });
  }

  
  ngOnInit() {

    this.join_challenge_flag = false;

    this.header_flag = true;
    $(document).ready(() => {
      // Preloader (if the #preloader div exists)
      $(window).on('load', function () {
        if ($('#preloader').length) {
          $('#preloader').delay(100).fadeOut('slow', function () {
            $(this).remove();
          });
        }
      });
    
      // Back to top button
      $(window).scroll(function() {
        if ($(this).scrollTop() > 100) {
          $('.back-to-top').fadeIn('slow');
        } else {
          $('.back-to-top').fadeOut('slow');
        }
      });
      $('.back-to-top').click(function(){
        $('html, body').animate({scrollTop : 0},1500, 'easeInOutExpo');
        return false;
      });
    
      // Initiate the wowjs animation library
      this.WOW.init();
    
      // Header scroll class
      $(window).scroll(function() {
        if ($(this).scrollTop() > 100) {
          $('#header').addClass('header-scrolled');
        } else {
          $('#header').removeClass('header-scrolled');
        }
      });
    
      if ($(window).scrollTop() > 100) {
        $('#header').addClass('header-scrolled');
      }
    
      // Smooth scroll for the navigation and links with .scrollto classes
      $('.main-nav a, .mobile-nav a, .scrollto').on('click', function() {
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
          var target = $(this.hash);
          if (target.length) {
            var top_space = 0;
    
            if ($('#header').length) {
              top_space = $('#header').outerHeight();
    
              if (! $('#header').hasClass('header-scrolled')) {
                top_space = top_space - 40;
              }
            }
    
            $('html, body').animate({
              scrollTop: target.offset().top - top_space
            }, 1500, 'easeInOutExpo');
    
            if ($(this).parents('.main-nav, .mobile-nav').length) {
              $('.main-nav .active, .mobile-nav .active').removeClass('active');
              $(this).closest('li').addClass('active');
            }
    
            if ($('body').hasClass('mobile-nav-active')) {
              $('body').removeClass('mobile-nav-active');
              $('.mobile-nav-toggle i').toggleClass('fa-times fa-bars');
              $('.mobile-nav-overly').fadeOut();
            }
            return false;
          }
        }
      });
    
      // Navigation active state on scroll
      var nav_sections = $('section');
      var main_nav = $('.main-nav, .mobile-nav');
      var main_nav_height = $('#header').outerHeight();
    
      $(window).on('scroll', function () {
        var cur_pos = $(this).scrollTop();
      
        nav_sections.each(function() {
          var top = $(this).offset().top - main_nav_height,
              bottom = top + $(this).outerHeight();
      
          if (cur_pos >= top && cur_pos <= bottom) {
            main_nav.find('li').removeClass('active');
            main_nav.find('a[href="#'+$(this).attr('id')+'"]').parent('li').addClass('active');
          }
        });
      });
    
      // jQuery counterUp (used in Whu Us section)
      $('[data-toggle="counter-up"]').counterUp({
        delay: 10,
        time: 1000
      });
  });
    
    
    
  }

  join(){
    this._chatService.joinRoom({user: this.user, code: this.code});

    this._chatService.statusRecieved()
    .subscribe(data=>{
   console.log("in join room")
     this.status = data.status;
     this.algo_Challenge=data.algorithm;
     console.log(this.status)
     console.log("we are here")
     console.log(this.algo_Challenge)

      this.main_challenge_flag = this.status;
      if(this.status){
        this.header_flag = false;
        
        this.start_challenge_flag = false;
        this.join_challenge_flag = false;
        this.windows_flag = true;
        this.exit_flag = true;
      }
   
    });
    
  }

  sendMessage(){
    this._chatService.sendMessage({user: this.user, message:this.messageText, code: this.code})
  }

  start_challenge(){
    this.join_challenge_flag = false;
    this.start_challenge_flag = true;
    this.code = Math.floor(Math.random() * (10000) + 1);
  }
  begin(){
    this.algorithm = $("#algorithm").val()
    console.log( this.algorithm);
    
    this._chatService.addChallengData(this.code,  this.algorithm)
  }
  join_challenge(){
    this.start_challenge_flag = false;
    this.join_challenge_flag = true;
  }

  exit_challenge(){
    console.log('here')
    this.header_flag = true;
    this.main_challenge_flag = false;
    this.windows_flag = false;
        this.exit_flag = false;
  }

  ViewTeam(id: String){
    this.view_team = true;
    this._chatService.getDocument(id)
  }


 

}
