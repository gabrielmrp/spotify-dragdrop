


groupArtists = function(lists){
       newString = (() => {let artists = ''; for (let i = 0; i < lists.length; i++) {artists+= lists[i].name+" + ";} return artists;})();
         
       return (newString+"#").replace(" + #","")
   } 

CallDropLink = function(html_data,plain_data,token,i,style,func=function(){},headerObj=""){

			 
			if((html_data+plain_data).search('spotify.com')<0){console.log(html_data);alert('Not spotify')}
			else{

	 		   droppedInfo= getDragDropInfo(plain_data,html_data);             

               url_link = droppedInfo['url_link']
               type = droppedInfo['type']
 
               getInfo = () =>{
               	$.ajax({
               		method: "GET",
               		dataType: "Json",
               		url:url_link,
               		headers: {
               			Authorization: `Bearer ${token}`
               		},
               		statusCode: {
               			401: function() {
                      //specific
               				//location.href="refresh/?workspace="+$('#workspace')[0].innerText+"&url_link="+elUrl               				
               			  location.href="/refresh/&url_link="+url_link        

                    }
               		} 

               	}).then(res => {  
               		CreateNodeByType(type,i,style,res,droppedInfo['droppedObject'],droppedInfo['elUrl'],headerObj)
               		console.log(func)
               		func===[]?false:func()                    
               	})
               };

          getInfo();
         }
     }

 








getDragDropInfo = function (plain_data,html_data){

			if(plain_data.search('/track/')>0){
               var type='music'
               var droppedObject = $('<div>').html(plain_data);
               elUrl = droppedObject[0].innerText
               trackId=droppedObject[0].innerText.split('https://open.spotify.com/track/')[1]
               url_link = "https://api.spotify.com/v1/tracks/"+trackId
            }
            else{
               
               
               var droppedObject = $('<div>').html(html_data);
               if(droppedObject[0].innerText=='')
               {
                  var droppedObject = $('<div>').html(plain_data);
                   elUrl = droppedObject[0].innerText
               }
               else{
                  elUrl =  $(droppedObject[0]).children()[0].href
               }
                 

               if(elUrl.search('/album/')>0){
                var type='album'
                albumId = elUrl.split('https://open.spotify.com/album/')[1]
                url_link = "https://api.spotify.com/v1/albums/"+albumId
               }
               if(elUrl.search('/artist/')>0){
                var type='artist'
                artistId =elUrl.split('https://open.spotify.com/artist/')[1]
                url_link = "https://api.spotify.com/v1/artists/"+artistId
                } 

               if(elUrl.search('/playlist/')>0){
               var type = 'playlist'
                playlistId = elUrl.split('https://open.spotify.com/playlist/')[1]
                url_link = "https://api.spotify.com/v1/playlists/"+playlistId
                } 
               
            }

            droppedInfo = {'url_link':url_link,
            				'type':type,
            				'droppedObject':droppedObject,
            				'elUrl':elUrl}

            return droppedInfo
        }

groupInfo = function (items){

 html = ''

 for (var i = 0; i < items.length; i++) {  

  html += '<small title='+items[i].key+' class="info">'+items[i].value+'</small>' 
  
  }
   return html

}


CreateNodeByType = function(type,i,style,res,droppedObject,elUrl,headerObj){

			  headerObj = headerObj==undefined?"<small>"+type+"</small>":headerObj
      console.log(res)  
        
      if(type=='album'){
        img = res.images[2].url
        content = res.images[2].url+"\n"+res.artists[0].name.replace("'","`")+"\n"+$(droppedObject[0]).children()[0].innerText
        info = groupInfo([{'key':'artist','value':res.artists[0].name},
                          {'key':'album','value':$(droppedObject[0]).children()[0].innerText},
                          {'key':'year','value':res.release_date}])

      }

        if(type=='music'){
        img = res.album.images[2].url
        content = res.album.images[2].url+"\n"+groupArtists(res.artists).replace("'","`")+"\n"+res.name.replace("'","`")
        info = groupInfo([{'key':'artist','value':groupArtists(res.artists)},{'key':'music','value':res.name.replace("'","`")}])

      }

      if(type=='artist'){
        img = res.images[2].url
        content = res.images[2].url+"\n"+res.name.replace("'","`")
        info = groupInfo([{'key':'artist','value':res.name.replace("'","`")}])

      }

      if(type=='playlist'){
        img = res.images[2].url || res.images[0].url
			  content = (res.images[2].url || res.images[0].url)+"\n"+res.name.replace("'","`")
        info = groupInfo([{'key':'playlist','value':res.name.replace("'","`")}])
      }

       node = "<div id='mydiv"+i+"' class='audiofile' style="+style+" >"+
                  "<div class='item_header'>"+
                    "<small>"+type+"</small>"+headerObj+
                  "</div>"+
                  "<div>"+
                  "<a href='"+elUrl+"' target='_blank'>"+
                      "<img src='"+img+"'  class='item img' style='' typefile = 'link/"+type+"' new='' content='"+content+"' url='"+elUrl+"'></img>"+
                  "</a>"+
                  "<div></div>"+
                  "<div style='display:grid'>"+info+"</div>"+
              "</div>";
         
       console.log(groupInfo(['a','b','c']))        
       $( "#content" ).append(node)


}