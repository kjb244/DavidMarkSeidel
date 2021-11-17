drop table if exists local_db_props;

create table local_db_props(
  id serial primary key,
  prop_key text,
  prop_value text
);

drop table if exists sms_count;

create table sms_count(
 id serial primary key,
 curr_date_time timestamp
);

drop table if exists email_count;

create table email_count(
  id serial primary key,
  curr_date date default current_date,
  count integer
);

drop table if exists key_value_storage;

create table key_value_storage(
  id serial primary key,
  key text,
  value text

);

drop table if exists key_value_storage_audits;

create table key_value_storage_audits (
  id serial primary key,
  key text not null,
  oldvalue text,
  newvalue text,
  sysdate timestamp);

create or replace function log_audits()
  returns trigger as
$$
begin
  if length(new.value) != length(old.value) THEN
    insert into key_value_storage_audits(key, oldvalue, newvalue, sysdate)
    values(new.key, old.value, new.value, now());
    return new;
  end if;

  return NULL;


end;
$$ LANGUAGE plpgsql;

CREATE TRIGGER log_audits_trigger
BEFORE UPDATE
  ON key_value_storage
FOR EACH ROW
EXECUTE PROCEDURE log_audits();


insert into key_value_storage (key, value) values ('copy','{"modal":{"heading":"This site requires a password","inputs":[{"type":"password","placeholder":"password","model":"password"}],"buttonText":"Submit"},"navBar":{"heading":{"who":"David Mark Seidel - Wedding Officiant, Planner, Vocalist"},"links":[{"name":"Welcome","route":"welcome"},{"name":"About","route":"about"},{"name":"Services","route":"services"},{"name":"Gallery","route":"gallery"},{"name":"Testimonial","route":"testimonial"},{"name":"Contact","route":"contact"}]},"routes":{"about":{"heading":"About David Mark Seidel","paras":["David Mark Seidel is an ordained minister and wedding officiant in good standing and licensed to perform weddings in the United States.","David  is a student and practitioner of World Faiths, among them: Christian, Jewish, Hindu, and Native American. He spent 10 years of dedicated scriptural study in monastic settings both in New York and India. His successful married life is 39 years strong and that was preceded by a 10 year blossoming friendship to his wife Jeanette ( and he is father to the handsomest 17 year old young man in Charlotte, son Jonathan ).","When you meet him, you will see and feel what he is all about and you will be very pleased you chose him to make your marriage a sacred and everlasting relationship. . Allow David to create a ceremony and an event that launches your marriage with exquisite positive energy, a day that will ''love you back to life again and again.''"],"image":{"imageLocation":"images/wedding-11.jpg","alt":"David Mark Seidel with Bride"}},"gallery":{"heading":"Gallery","photos":[{"title":"Wedding Highlights","photoDetails":[{"imageLocation":"images/wedding-1.jpg","alt":"David Mark Seidel Wedding Sunset"},{"imageLocation":"images/wedding-2.jpg","alt":"David Mark Seidel Wedding with Groom"},{"imageLocation":"images/wedding-3.jpg","alt":"Flowergirl"},{"imageLocation":"images/wedding-4.jpg","alt":"Ring bearer"},{"imageLocation":"images/wedding-5.jpg","alt":"David Mark Seidel Videographer"},{"imageLocation":"images/wedding-6.jpg","alt":"David Mark Seidel Officiating"},{"imageLocation":"images/wedding-7.jpg","alt":"David Mark Seidel Officiating 2"},{"imageLocation":"images/wedding-8.jpg","alt":"Bride Groom kiss"},{"imageLocation":"images/wedding-9.jpg","alt":"Bride Groom with son"},{"imageLocation":"images/wedding-10.jpg","alt":"David Mark Seidel Sunset"}]},{"title":"Cape May New Jersey 2018","photoDetails":[{"imageLocation":"images/capemay-1.jpg","alt":"David Mark Seidel Officiating"},{"imageLocation":"images/capemay-2.jpg","alt":"Bride and Groom reading vows"},{"imageLocation":"images/capemay-3.jpg","alt":"Bride and Groom kissing"},{"imageLocation":"images/capemay-4.jpg","alt":"David Mark Seidel announcing marriage"},{"imageLocation":"images/capemay-5.jpg","alt":"Flower toss"},{"imageLocation":"images/capemay-6.jpg","alt":"Bride and Groom photo session"}]},{"title":"Great Weddings 2018","photoDetails":[{"imageLocation":"images/wedding-18.jpg","alt":"Wedding Lake"},{"imageLocation":"images/wedding-19.jpg","alt":"David Mark Seidel with Bride and Groom"},{"imageLocation":"images/wedding-20.jpg","alt":"Bride and Groom kissing"},{"imageLocation":"images/wedding-21.jpg","alt":"David Mark Seidel with Bride and Groom"}]}],"videos":[{"title":"Roselee & David Video","iframe":"<iframe src=\"https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Ffippsfilmingco%2Fvideos%2F766456046812511%2F&width=500&show_text=false&height=280&appId\"  height=\"280\" style=\"border:none;overflow:hidden\" scrolling=\"no\" frameborder=\"0\" allowTransparency=\"true\" allow=\"encrypted-media\" allowFullScreen=\"true\"></iframe>"},{"title":"Nicole & T.J. Video","specialStyling":true,"iframe":"<iframe src=\"https://player.vimeo.com/video/273026374?color=db82e2&title=0&byline=0&portrait=0\" width=\"640\" height=\"280\" frameborder=\"0\" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>"}]},"services":{"heading":"David Mark Seidel has a package to fit every couple’s needs and budget. He will customize one just for you that is perfect for your ceremony. He is an ordained minister and wedding officiant in good standing and licensed to perform weddings in the United States.  He will also serve your Wedding as a Planner and provide beautiful Vocal solos for the Ceremony and Reception!","subHeading":"","data":[{"heading":"Civil Ceremony","price":false,"description":"Our Civil Ceremony is the most basic of our packages. These ceremonies are perfect for couples looking to tie the knot in a quick, but meaningful manner.","points":["Set ceremony script","Lovely, keepsake certificates of marriage suitable for framing","Experienced, professional and caring officiant for your ceremony","Vocal music can be sung by David if requested","Marriage license(s) sent back to the County Clerk of Record","Can be performed anywhere within Mecklenburg County – outside of county may include a small travel fee"]},{"heading":"Planned Ceremony","price":false,"description":false,"points":["Ceremony, wedding vows, and custom script development for the big day","As much phone and e-mail communication and personal consultation as needed","Pre-marital counseling is available to all couples with at least one session being the recommended minimum commitment","Vocal music can be sung by David if requested","Lovely, keepsake certificates of marriage suitable for framing","Marriage license(s) sent by certified mail back to the County Clerk of Record","Travel within Mecklenburg County – a small travel fee may incur if outside the county","Rehearsals are optional","Optional professional music coordination for the ceremony with our in-house audio technician."]},{"heading":"Pre-Marital Counseling","price":false,"description":false,"points":["Typically 4 counseling sessions that focus on building inspiring relationship skills:  communication of feelings with good listening, self-inquiry, intimacy, and humor.  At least one session being the recommended minimum commitment."]},{"heading":"Wedding Planner","price":false,"description":false,"points":["David provides FREE Vendor selection and management of:","Venue, Caterer, DJ, Musicians, Vocalist, Photographer, Videographer, Rentals, Cake, Floral, Décor, Dress, Transportation, Lodging"]},{"heading":"Vocalist","price":false,"description":false,"points":["As a Vocalist, David approaches the marriage ceremony and reception as a wondrous vessel infused with joy and celebration and offers love songs from the Best of Broadway and The Great American Songbook, making your wedding a day that will ''love you back to life again and again.''"]}]},"testimonials":{"heading":"What Couples Are Saying","data":[{"text":["Reverend David was awesome! We were searching for an officiant a few weeks before the wedding as the officiant we had lined up fell through. We’re so thankful we found Reverend David. He was transparent, easy to work with, and very professional. It was more than just a service he provided but he wanted to get to know not only my fiancé and I but our families and friends as well. He did an amazing job at our ceremony and it really couldn’t have been more perfect. So much so that my mother in law is using him to officiate her upcoming wedding. :) Thanks so much, Reverend David!!"],"person":"Shellie","sub":"5/26/2018"},{"text":["We met with him and he was so amazing! He heard our story agreed to married us and made it a truly unforgettable experience. He gave us guidance and was great to work with. He is a great man of God and officiant. I recommend him for anyone looking to have a great marriage experience."],"person":"D","sub":"6/29/2018"},{"text":["I am a professional musician who for the past 7 years have played for weddings almost every weekend. I have experienced a variety of officiants and Reverend David Mark Seidel stood out to me. He was so sweet and uplifting. His approach was unique and creative. I am planning my own wedding in September of 2018 and am planning on using his services so that I can also have such a warm, intimate atmosphere at my wedding."],"person":"Diane","sub":"9/15/2018"},{"text":["Reverend David performed my nephew''s wedding in a very professional and friendly manner. I like the fact that he likes to come an hour earlier before the ceremony to talk to groom and bride and meet the family member.. It was a very nice and sweet ceremony. Thank you Reverend David."],"person":"Roxana","sub":"6/15/2018"},{"text":["Our day couldn’t have been made without Reverend David marrying us! He was extremely warming and you felt as if he truly cared about your wedding and marriage. He was extremely professional, helpful, and encouraging through all the wedding planning. We highly recommend anyone seeking to get married to book Rev. David!"],"person":"Kressle","sub":"4/14/2018"},{"text":["We just had our wedding this weekend. Thank you Reverend David. The ceremony was beautiful. We appreciate your attention to details. We also like the fact that he time to get to know us and tried to accommodate our wishes."],"person":"Yisel","sub":"3/10/2018"},{"text":["Great person and very charismatic and really friendly and easy to talk too"],"person":"Marilyn","sub":"3/15/2018"},{"text":["I have worked directly with David for a long time, he is very dedicated and take great pride in the job he does. He puts the bride and groom first and will ALWAYS make your special day that much more wonderful. Don''t waste time looking for other Wedding Officiants, book him if you can, he is a busy man that really cares and is very talented!!!"],"person":"Don","sub":"2/26/2018"},{"text":["I had the opportunity to met and experience a great and personal ceremony when Reverend David Seidel married by son and daughter in law. He had a special touch and it was just the best!"],"person":"Allen","sub":"2/24/2018"},{"text":["Rev. Seidel was a wonderful officiant to work with. He did an excellent job of preparing us for our wedding day and listening to our goals for our service and ceremony. His personality and demeanor were truly a delight!!"],"person":"Angela","sub":"2/24/2018"},{"text":["Pastor Seidel was very warm and welcoming. Couldn''t have asked for a more beautiful ceremony."],"person":"Erica","sub":"2/23/2018"},{"text":["I was very involved in the planning of my brothers wedding and was having trouble finding an officiant who could conduct the ceremony in Spanish (as brides family would be streaming from overseas). Reverend David Mark Seidel conducted a beautiful ceremony in all spanish and made it feel very personal with moments of laughter as well as moments with tears. Received so many positive comments after ceremony. Could not be happier with the way it all turned out."],"person":"Tania","sub":"2/3/2018"},{"text":["Reverend David assisted us with a beautiful wedding ceremony. Not only did he have hart warming speech but also performed it in Spanish for us, family and, friends. Reverend David was kind and explained every step to us. He was very reliable and professional and would definitely recommend him if you are planning to get married. Thank you so much Reverend David!!!!"],"person":"David","sub":"2/3/2018"},{"text":["David''s remarkable uplifting personality and attitude towards a loving ceremony made it all the more. He was extremely sensitive to the newlyweds needs and emotions they were feeling. I would encourage everyone thinking about marriage to sit down and chat with David and you''ll see that he will be the perfect person to officiate. Thank you David for making a beautiful ceremony happen with such grace and ease."],"person":"Steven","sub":"1/21/2018"},{"text":["If a white hat is the sign of a man with a big heart for sharing the truth about love then David Mark Seidel is the best officiant reverend I have experienced in some time. David intentionally honored the precious souls in the family that contributed to the BIG story of the wedding couple. He did it with humility while gracefully prompting others in the family to speak about their relationship with the couple. The ceremony flowed with emotion as I felt led to understand what marriage for Kyle and Bri would mean for them. Kudos to a a very polished man of God!"],"person":"Michael","sub":"1/21/2018"},{"text":["Weddings are a time of unity, laughter and happily ever after. Reverend David Seidel helped our family to accomplish all those things. His loving, yet professional, demeanor struck just the right note. His sense of humor and understanding heart helped us create a day we will remember always."," As the song goes, ''Love isn''t Love until you give it away.'' I am sure that everyone at the wedding loved a bit more deeply as he guided us all through this song and message. Thank You!"],"person":"Helen","sub":"1/21/2018"},{"text":["My son and his new wife were honored to have Reverend David officiate their wedding last Sunday. He made the event especially poignant and personal. I highly recommend David to bring your loved ones together!"],"person":"Shella","sub":"1/21/2018"},{"text":["David was so responsive and flexible and only ever cared about making sure the moment my wife and I shared was as special and memorable as possible. Just be upfront with him and he will deliver ten fold. He is the most sincere and honest person you will ever meet!"],"person":"Kyle","sub":"1/21/2018"},{"text":["Rev. David was Amazing. He made our ceremony a family event. He involved our kids in every aspect. He spoke the words that my husband and I have been wanting to say to each other we just didn’t know how.","The most important and wonderful thing he did for us was, He Sang a very special song for Mike and I. Our family couldn’t have asked for a better day. Rev. Davis is the reason. We wish him happiness, good health, but most of all Love and Laughter for the New Year."],"person":"Michael","sub":"12/23/2017"},{"text":["Great experience. One of a kind character. Made my daughter''s wedding a unique occasion. Great personality, very likable fellow."],"person":"Mary","sub":"12/2/2017"},{"text":["This was my first experience being at a wedding ceremony. He was great! Loved how he kept a smile! Thank David!"],"person":"Jenese","sub":"11/9/2017"},{"text":["Rev.Seidel is wonderful. Officiated Stanley and Wanda Wright wedding on 11/09/17.Great guy ! Family and friends very pleased. Thanks Rev. Seidel we love you."],"person":"Wanda","sub":"11/9/2017"},{"text":["Reverend David was an all around AMAZING minister, leader and witness in the Wright’s wedding ceremony. I served as a Professional Videographer for this wedding and what stood out to me the most was Reverend David’s ability to connect with the essence of his peers.","He was sharp, on time, and even stayed after the ceremony to connect with everyone who was gracefully involved.","Highly recommend this professional here! There isn’t any other minister you’d need."],"person":"Jeffrey","sub":"11/9/2017"},{"text":["D would love to share my appreciation for Rev.D.Seidel. The marriage sermon for my brother and his new wife was professional but yet the Spirit of God was present. He was serious but there was times when he made us all laugh, this was my first time meeting him and if i ever get blessed to get married if i can not have Rev. David Seidel I sure pray that it is someone like him. God Bless you Reverend Seidel."],"person":"Debra/Wanda Wright","sub":"11/9/2017"},{"text":["Reverend David Mark Seidel was very professional, involved, and encouraging during the process. I would recommend him to anyone."],"person":"Michael","sub":"11/4/2017"},{"text":["I struggle to find words depicting how perfect our ceremony, and just day in general, was. Everything came together as it should, and I believe it to be so because of Reverend Seidel’s leading role. His graciousness, leadership, positive attitude, and loving aura, smoothed the day over like a polished stone. Everyone went out of their way to compliment him, and they weren’t even aware of the phenomenal person he was behind the scenes. He is now my friend. He is now my family. I can not thank him enough. That being said, I highly recommend having him benefit any services he offers that you are in need of. Again to Reverend Seidel… Thank you. Thank you, thank you."],"person":"David","sub":"10/21/2017"},{"text":["David was excellent! He was everything you want a wedding officiant to be!."],"person":"Cindy","sub":"10/21/2017"},{"text":["My son and daughter-in-law chose the right man for the job. Very professional but also lots of fun. I wish him the best!"],"person":"Beverly","sub":"11/21/2017"},{"text":["Wedding was spectacular, David was awesome! He meet our expectations. Every one was very pleased with the way he run the Ceremony. My Mother and her husband were very happy with his service.","Thank you David."],"person":"Marily","sub":"9/1/2017"},{"text":["Reverend David did a great job on our wedding with short short notice. He made it to the ceremony with plenty of time and was able to check out the ceremony set up to see the layout of where he would be standing and how we would be coming in; he even was a little involved in the decision making process. He gave a beautiful bilingual ceremony that everyone enjoyed, so I would easily recommend him for anyone interested in a bilingual ceremony."],"person":"Anthony","sub":"5/27/2018"}]},"contact":{"header":"Interested in Connecting?","subHeader":"Please call or text David Mark Seidel at <a id=''contactNum'' href=''tel:7045267284''>704.526.7284</a> or fill out the information below"},"welcome":{"heading":"David Mark Seidel - Wedding Officiant, Planner, Vocalist","headingSub":"Multi-Lingual, Multi-Cultural, Ambassador of Love","paras":["For more than 35 years, David has been performing ceremonies all over the  world.","His weddings have been featured on Live with Kelly and Ryan, ABC NEWS, and all major news outlets! Reverend David is a one-of-a-kind Original. No one else inside the Wedding industry is able to bring the level of intimacy and trust to a ceremony like he does. His trademark is to allow the entire gathering of family and friends to bestow their blessings on the Newlyweds, just as the couple blesses each other. A wedding with Reverend David is a gathering fully engaged in the ritual of celebration, not merely spectators at a distance. ","He currently officiates non-denominational weddings in the Carolinas and beyond!  His couples enjoy pre-marital counseling sessions that focus on building inspiring relationship skills:  communication of feelings with good listening, self-inquiry, intimacy, and  humor.  ","He is an expert Wedding Planner, providing FREE Vendor selection and management of: Venue, Caterer, DJ, Musicians, Vocalist, Photographer, Videographer, Rentals, Cake, Floral, Décor, Dress, Transportation, and Lodging.","As a Vocalist, David approaches the marriage ceremony as a wondrous vessel infused with joy and celebration and offers love songs from the Best of Broadway and The Great American Songbook!","If you are interested in booking David you can use our contact page, reach him at <a id=''contactNum'' href=''tel:7045267284''>704.526.7284</a>, or <a id=''emailDavidMarkSeidel'' href=''mailto:david@davidmarkseidel.com''>david@davidmarkseidel.com</a> for availability. David is multi-lingual Spanish/English, <span class=''blue''>Se Habla Espanol</span> and also is skilled in Hindi/Sanskrit for Indian weddings and Pujas. Same Sex Unions are Welcome."],"images":[{"location":"images/wedding-1.jpg","alt":"Wedding Picture David Seidel with Couple Sunset"},{"location":"images/wedding-17.jpg","alt":"Wedding Picture David Seidel with Couple"}]},"home":{"backgroundImage":"","heading":"Kevin & Robyn","aboutUs":{"heading":"Hello","subHeading":"Welcome to our wedding website! You should find all information you need to share our special day with us."}}},"footer":{"sections":[{"title":"Navigation","type":"Links","content":[{"hash":"#/welcome","text":"Welcome"},{"hash":"#/about","text":"About"},{"hash":"#/services","text":"Services"},{"hash":"#/gallery","text":"Gallery"},{"hash":"#/testimonial","text":"Testimonial"},{"hash":"#/contact","text":"Contact"}]},{"title":"Contact","type":"Contact","content":["<a id=''contactNumFooter'' href=''tel:7045267284''>704.526.7284</a>"]},{"title":"Location","type":"Default","content":["Charlotte, NC 28210"]},{"title":"Social","type":"Social","content":[{"href":"https://www.facebook.com/pages/category/Local-Business/Reverend-David-Mark-Seidel-1402710086513124/","icon":"facebook"},{"href":"https://www.instagram.com/revdavidseidel/","icon":"instagram"}]}],"copyright":"@CopyRight David Mark Seidel - All Rights Reserved"}}');
