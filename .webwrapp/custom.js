self.WebWrapp.onPageLoad = function () {

  // Create a toolbar along the bottom of the app with a link to the "homepage" and share buttons for the page you are on
  var Controls = document.createElement( 'div' );
  Controls.setAttribute( 'style', 'width: 100vw; height: 60px; display: block; position: fixed; top: calc(100vh - 60px); left: 0; z-index: 2147483646; border: 0; background-color: #eee;' );


  var Home = document.createElement( 'div' );
  Home.setAttribute( 'style', 'width: 20%; height: 60px; display: block; position: relative; float: left; border: 0; background-repeat: no-repeat; background-size: 70px 48px; background-position: 0 6px; background-color: #666;' );
  Home.style.backgroundImage = 'url("' + "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 460 460' fill='%23fff'%3E%3Cpath d='M487.083 225.514l-75.08-75.08v-86.73c0-15.682-12.708-28.391-28.413-28.391-15.669 0-28.377 12.709-28.377 28.391v29.941L299.31 37.74c-27.639-27.624-75.694-27.575-103.27.05L8.312 225.514c-11.082 11.104-11.082 29.071 0 40.158 11.087 11.101 29.089 11.101 40.172 0l187.71-187.729c6.115-6.083 16.893-6.083 22.976-.018l187.742 187.747a28.337 28.337 0 0 0 20.081 8.312c7.271 0 14.541-2.764 20.091-8.312 11.086-11.086 11.086-29.053-.001-40.158z'/%3E%3Cpath d='M257.561 131.836c-5.454-5.451-14.285-5.451-19.723 0L72.712 296.913a13.977 13.977 0 0 0-4.085 9.877v120.401c0 28.253 22.908 51.16 51.16 51.16h81.754v-126.61h92.299v126.61h81.755c28.251 0 51.159-22.907 51.159-51.159V306.79c0-3.713-1.465-7.271-4.085-9.877L257.561 131.836z'/%3E%3C/svg%3E" + '")';

  var Twitter = document.createElement( 'div' );
  Twitter.setAttribute( 'style', 'width: 20%; height: 60px; display: block; position: relative; float: left; border: 0; background-repeat: no-repeat; background-size: 60px 60px; background-position: 6px 0; background-color: rgb(29, 161, 242);' );
  Twitter.style.backgroundImage = 'url("' + "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 32 32' fill='%23fff'%3E%3Cpath d='M27.996 10.116c-.81.36-1.68.602-2.592.71a4.526 4.526 0 0 0 1.984-2.496 9.037 9.037 0 0 1-2.866 1.095 4.513 4.513 0 0 0-7.69 4.116 12.81 12.81 0 0 1-9.3-4.715 4.49 4.49 0 0 0-.612 2.27 4.51 4.51 0 0 0 2.008 3.755 4.495 4.495 0 0 1-2.044-.564v.057a4.515 4.515 0 0 0 3.62 4.425 4.52 4.52 0 0 1-2.04.077 4.517 4.517 0 0 0 4.217 3.134 9.055 9.055 0 0 1-5.604 1.93A9.18 9.18 0 0 1 6 23.85a12.773 12.773 0 0 0 6.918 2.027c8.3 0 12.84-6.876 12.84-12.84 0-.195-.005-.39-.014-.583a9.172 9.172 0 0 0 2.252-2.336' fill-rule='evenodd'/%3E%3C/svg%3E" + '")';

  var Facebook = document.createElement( 'div' );
  Facebook.setAttribute( 'style', 'width: 20%; height: 60px; display: block; position: relative; float: left; border: 0; background-repeat: no-repeat; background-size: 60px 60px; background-position: 6px 0; background-color: rgb(59, 89, 152);' );
  Facebook.style.backgroundImage = 'url("' + "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 32 32' fill='%23fff'%3E%3Cpath d='M22 5.16c-.406-.054-1.806-.16-3.43-.16-3.4 0-5.733 1.825-5.733 5.17v2.882H9v3.913h3.837V27h4.604V16.965h3.823l.587-3.913h-4.41v-2.5c0-1.123.347-1.903 2.198-1.903H22V5.16z'/%3E%3C/svg%3E" + '")';

  var Pinterest = document.createElement( 'div' );
  Pinterest.setAttribute( 'style', 'width: 20%; height: 60px; display: block; position: relative; float: left; border: 0; background-repeat: no-repeat; background-size: 60px 60px; background-position: 6px 0; background-color: rgb(203, 32, 39);' );
  Pinterest.style.backgroundImage = 'url("' + "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 32 32' fill='%23fff'%3E%3Cpath d='M7 13.252c0 1.81.772 4.45 2.895 5.045.074.014.178.04.252.04.49 0 .772-1.27.772-1.63 0-.428-1.174-1.34-1.174-3.123 0-3.705 3.028-6.33 6.947-6.33 3.37 0 5.863 1.782 5.863 5.058 0 2.446-1.054 7.035-4.468 7.035-1.232 0-2.286-.83-2.286-2.018 0-1.742 1.307-3.43 1.307-5.225 0-1.092-.67-1.977-1.916-1.977-1.692 0-2.732 1.77-2.732 3.165 0 .774.104 1.63.476 2.336-.683 2.736-2.08 6.814-2.08 9.633 0 .87.135 1.728.224 2.6l.134.137.207-.07c2.494-3.178 2.405-3.8 3.533-7.96.61 1.077 2.182 1.658 3.43 1.658 5.254 0 7.614-4.77 7.614-9.067C26 7.987 21.755 5 17.094 5 12.017 5 7 8.15 7 13.252z' fill-rule='evenodd'/%3E%3C/svg%3E" + '")';

  var LinkedIn = document.createElement( 'div' );
  LinkedIn.setAttribute( 'style', 'width: 20%; height: 60px; display: block; position: relative; float: left; border: 0; background-repeat: no-repeat; background-size: 60px 60px; background-position: 6px 0; background-color: rgb(0, 119, 181);' );
  LinkedIn.style.backgroundImage = 'url("' + "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 32 32' fill='%23fff'%3E%3Cpath d='M26 25.963h-4.185v-6.55c0-1.56-.027-3.57-2.175-3.57-2.18 0-2.51 1.7-2.51 3.46v6.66h-4.182V12.495h4.012v1.84h.058c.558-1.058 1.924-2.174 3.96-2.174 4.24 0 5.022 2.79 5.022 6.417v7.386zM8.23 10.655a2.426 2.426 0 0 1 0-4.855 2.427 2.427 0 0 1 0 4.855zm-2.098 1.84h4.19v13.468h-4.19V12.495z' fill-rule='evenodd'/%3E%3C/svg%3E" + '")';


  Home.addEventListener( 'click', function () {
  	window.location.href = window.WebWrappConfig.homePage;
  } );

  Twitter.addEventListener( 'click', function () {
  	window.location.href = 'https:'+'//twitter.com/intent/tweet?related=&text='+ encodeURIComponent( document.title ) + '&url='+ encodeURIComponent( window.location.href );
  } );

  Facebook.addEventListener( 'click', function () {
    // Replace APPID with your own published Facebook App ID
  	window.location.href = 'https:'+'//www.facebook.com/dialog/share?app_id=APPID&description=&redirect_uri=&display=&picture=&title='+ encodeURIComponent( document.title ) + '&href='+ encodeURIComponent( window.location.href );
  } );

  Pinterest.addEventListener( 'click', function () {
  	window.location.href = 'https:'+'//pinterest.com/pin/create/button/?&media=&description=' + encodeURIComponent( document.title ) + '&url='+ encodeURIComponent( window.location.href );
  } );

  LinkedIn.addEventListener( 'click', function () {
    window.location.href = 'https:'+'//www.linkedin.com/shareArticle?mini=true&ro=false&summary=&source=&title='+ encodeURIComponent( document.title ) +'&url='+ encodeURIComponent( window.location.href );
  } );


  Controls.appendChild( Home );

  Controls.appendChild( Facebook );
  Controls.appendChild( Twitter );
  Controls.appendChild( Pinterest );
  Controls.appendChild( LinkedIn );

  document.body.appendChild( Controls );
}
