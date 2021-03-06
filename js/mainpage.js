var signIn=false;//sign status
var signAdmin=false;//the sign in account is an admin
var accountIndex=-1;//account index
var checkingcart=false;//checking items in cart
var Email="";

var item_names=["Bandai Hobby RG 1/144 Mobile Suit Gundam ZGMF-X09A Justice Gundam","Bandai Hobby HG 1/144 Mobile Suit Gundam ZGMF-X10A Freedom Gundam", 
"Bandai Hobby HG 1/144 Mobile Suit Gundam RX-77-2 Guncannon Gundam", "Bandai Hobby HG 1/144 Mobile Suit Gundam RX-78 Gundam MK-II(A.E.U.G)", 
"Bandai Hobby MG 1/100 Mobile Suit Gundam GN-0000GNHW 00 Gundam Seven Sword/G", "Bandai Hobby RG 1/144 Mobile Suit Gundam GN-0000+GNR-010 00Raiser Gundam", 
"Bandai Hobby HG 1/144 Mobile Suit Gundam MISS SAZABI Gundam"];

var item_colors=[["test_item/71.jpg"],["test_item/hgce-freedom-gundam-revive-1-768x484.jpg"],["test_item/newborn-revive-guncannon-box-art-2.jpg"],
["test_item/201511021821571f8-768x486.jpg"],["test_item/20110831001953816.jpg"],["test_item/TB1vP0sHFXXXXbkaXXXXXXXXXXX_!!0-item_pic.jpg"],
["test_item/TB2v48udXXXXXamXXXXXXXXXXXX_!!2340787172.jpg"]];

var item_pics=["test_item/71.jpg","test_item/hgce-freedom-gundam-revive-1-768x484.jpg","test_item/newborn-revive-guncannon-box-art-2.jpg",
"test_item/201511021821571f8-768x486.jpg","test_item/20110831001953816.jpg","test_item/TB1vP0sHFXXXXbkaXXXXXXXXXXX_!!0-item_pic.jpg",
"test_item/TB2v48udXXXXXamXXXXXXXXXXXX_!!2340787172.jpg"];

var item_price=["24.40","22.99","22.99","22.99","46.40","26.40","22.99"];

var promotion_code=["20","0","0","10","0","5","30"];

var promo_due=["2019-05-12","","","2019-07-01","","2019-04-22","2019-06-22"];

var promo_start=["2019-04-01","","","2019-06-01","","2019-04-01","2019-04-01"];

var item_InStock=["99","99","99","99","99","99","99"];

var item_Vprice=["21.99","20.00","20.00","20.00","43.99","23.99","20.00"];

var item_sellers=["Eric Zala","Eric Zala","Tomas","Eric Zala","Eric Zala","Xiaolei Zhang","Eric Zala"];

//object at first Index include attr: mail,phone,password,name,index
var reg_accounts=[];

var payment_card=[["V1928384728195427","Queqiren","07/2022"],["D1047288390131761","Queqiren","10/2020"]];

var guest_promo_list=[];

//include index of item
var user_promo_list=[[]];

var order=[];

var item_descrips=[];

function open_sign()//open sign div
{
	if(signIn==true)
	{
		show_account();
		return;
	}
	sign=document.getElementById("sign_page");
	if(sign.getAttribute("class")=="display_off")
	{
		sign.setAttribute("class","display_on");
		sign.removeAttribute("style");
	}
	else
	{
		sign.setAttribute("class","display_off");
		sign.setAttribute("style","display: none;")
	}
}

function close_sign()//close sign div
{
	div=document.getElementById("delete_div");
	div.parentElement.setAttribute("class","display_off");
	div.parentElement.setAttribute("style","display: none;");
	document.getElementById("wrong_pass").setAttribute("style","display: none;");
}

//slide down chart
$(document).ready(function(){
$(".nav_cart").click(function(){
    $("#cart_div").slideToggle("slow");
    $("#cart_div").css("overflow-x","hidden");
    $("#cart_div").css("overflow-y","auto");
  });
})

//open registration page
function create_user(){
	window.open("registration.html")
}

function hidepage(){
	list=document.getElementsByClassName("big_page");
	for (let i=0;i<list.length;i++)
	{
		list[i].setAttribute("style","display: none;");
	}
	clear_item_page();
}

//open home page
function show_home(){
	content=document.getElementById("content");
	hidepage();
	content.setAttribute("style","display: block;");
}

//open account page
function show_account(){
	if(signIn==false)
	{
		open_sign();
		return;
	}
	account=document.getElementById("account");
	hidepage();
	account.removeAttribute("style");
}

//add info from DB to reg_accounts
function pushTOAccount(msg){
	update_getPromoDB();
	getOrderHistoryDB();
	getCard();
	document.getElementById("your_orders").addEventListener("click",show_order);
	console.log(msg);
	accountIndex=0;
	signIn=true;
	order=[];
	if(Email=="t")
	{
		signAdmin=true;
		changeAccount_Ad();
	}
	if(Email.substring(0,1)=="*")
	{
		signAdmin=true;
		changeAccount_Ad();
		close_sign();
		document.getElementById("sign_out").removeAttribute("style");
		return;
	}
	close_sign();
	document.getElementById("sign_out").removeAttribute("style");
	let list=[];
	list.push(msg.fname);
	list.push(msg.lname);
	list.push(msg.order);
	list.push(msg.cart);
	list.push(msg.promo);
	list.push(msg.VIP);
	reg_accounts.push(list);
	msg.cart=msg.cart.substring(0,msg.cart.length-1);
	let cartlist=msg.cart.split(",");
	if(msg.cart!="")
	{
		cartlist.forEach(function(x){
			x=x.split(" ")
			addcartFromDB(x[0]/1-1,x[1]);});
	}
	if(msg.promo!="")
	{
		let promolist=msg.promo.substring(0,msg.promo.length-1).split(" ");
		user_promo_list=[[]];
        promolist.forEach(function(x){addDB_Promo(x/1-1);});
	}
	updateCartDB();
	getMoveIndex();
}

function getMoveIndex(){
	let email=Email;
	$.ajax({
		type: "post",
		url: "getMove.php",
		data: {
			email: email
		},
		dataType: "json",
		success: function(msg) {
			update_promoId(msg.str/1);
	        update_cartId(msg.str/1);
	},
		error: function(msg) {
		}
	});
}

function getCard(){
	let email=Email;
	$.ajax({
		type: "post",
		url: "getCard.php",
		data: {
			email: email
		},
		dataType: "json",
		success: function(msg) {
			msg=msg.str.substring(0,msg.str.length-1);
			let list=msg.split(";");
			for(let t=0;t<list.length;t++)
			{
				list[t]=list[t].split(",");
			}
			payment_card=list;
	},
		error: function(msg) {
		}
	});
}

//add promo from DB to user_promo
function addDB_Promo(t)
{
	user_promo_list[0].push(t);
}

//check sign data with database
function check_signIn(){
	let currpass=document.getElementById("sign_password").value;
	currAccount=document.getElementById("sign_account").value;
	document.getElementById("sign_account").value="";
	document.getElementById("sign_password").value="";
	let $sql=0;
	let sign_type=0;
	if(currAccount=="")
	{
		document.getElementById("wrong_pass").removeAttribute("style");
		return;
	}
	if(currAccount.substring(0,1)=="*")//admin
	{
		pass=currpass;
		email=currAccount;
		sign_type=1;//sign in admin
		$.ajax({
		type: "post",
		url: "reg_sign.php",
		data: {
			type: sign_type,
			email: email,
			pass: currpass
		},
		dataType: "json",
		success: function(msg) {
			var last=JSON.stringify(msg);
			msg=JSON.parse(last);
			$sql=msg.pass;
			if($sql!=1)//wrong pass or account name
	        {
		        document.getElementById("wrong_pass").removeAttribute("style");
		        return;
	        }
	        Email=currAccount;
			pushTOAccount(msg);
		},
		error: function(msg) {
			document.getElementById("wrong_pass").removeAttribute("style");
		}
	    });
	}
	else if(currAccount.indexOf("@")!=-1)//sign by mail address
	{
		pass=currpass;
		email=currAccount;
		sign_type=2;//sign in reg by email
		$.ajax({
		type: "post",
		url: "reg_sign.php",
		data: {
			type: sign_type,
			email: email,
			pass: currpass,
		},
		dataType: "json",
		success: function(msg) {
			var last=JSON.stringify(msg);
			msg=JSON.parse(last);
			$sql=msg.pass;
		    if($sql!=1)//wrong account name
	        {
		        document.getElementById("wrong_pass").removeAttribute("style");
		        return;
	        }
	        Email=currAccount;
			pushTOAccount(msg);
		},
		error: function(msg) {
			document.getElementById("wrong_pass").removeAttribute("style");
		}
	   });
	}
	else//sign by phone
	{
		let phone=currAccount;
		sign_type=3;//sign in reg by phone
		//$.ajax({
		//type: "post",
		//url: "reg_sign.php",
		//data: {
		//	type: sign_type,
		//	phone: phone,
		//	pass: currpass
		//},
		//dataType: "json",
		//success: function(msg) {
		//	$sql=msg.pass;
		//	if($sql==0)//wrong account name
	    //    {
		//        document.getElementById("wrong_pass").removeAttribute("style");
		//        return;
	    //    }
		//	pushTOAccount(msg);
		//},
		//error: function(msg) {
		//	console.log(msg);
		//}
	    //});
	    $sql=1;
	    Email=currAccount;
	    msg={fname:"Eric", lname:"Que", cart:"1 2,3 5,", promo:"1 3 ", VIP:"1",pass:"1 "};
	    pushTOAccount(msg);
	}
}

//if the user is admin, change describtion to admin type
function changeAccount_Ad(){
	document.getElementById("your_orders").firstElementChild.nextElementSibling.innerHTML="Order Info";
	document.getElementById("VELZ's_VIP").firstElementChild.setAttribute("src","img/store.png");
	document.getElementById("your_orders").lastElementChild.innerHTML="View and update your orders";
	document.getElementById("your_orders").removeEventListener("click",show_order);
	document.getElementById("your_orders").addEventListener("click",admin_order);
	document.getElementById("VELZ's_VIP").firstElementChild.nextElementSibling.innerHTML="My Warehouse";
	document.getElementById("VELZ's_VIP").addEventListener("click",open_warehouse);
	document.getElementById("VELZ's_VIP").lastElementChild.innerHTML="View and update your goods";
	document.getElementById("payment_options").firstElementChild.nextElementSibling.innerHTML="Revenue Info";
	document.getElementById("payment_options").lastElementChild.innerHTML="Check your revenue data";
	document.getElementById("Promo_Codes").lastElementChild.innerHTML="Update your Promo Codes";
	document.getElementById("Promo_Codes").removeEventListener("click",open_view_promo);
	document.getElementById("Promo_Codes").addEventListener("click",open_edit_promo);
}

function open_warehouse()
{
	let update_goods=document.getElementById("update_goods");
	hidepage();
	update_goods.removeAttribute("style");
}

//show view promo page for reg
function open_view_promo()
{
	let tbody=document.getElementById("view_promo_tbody");
	tbody.innerHTML="";
	let view_promo=document.getElementById("view_promo");
	hidepage();
	view_promo.removeAttribute("style");
	let list=user_promo_list[0];
	list.forEach(function(x){
		if(promotion_code[x]!=0)
		addViewPromo(x);})
}

//add the promotion details to view promo page, x is the id of item
function addViewPromo(x)
{
	let tbody=document.getElementById("view_promo_tbody");
	let tr=document.createElement("tr");
	tbody.appendChild(tr);
	let td=document.createElement("td");//item name
	td.innerHTML=item_names[x];
	tr.appendChild(td);
	td=document.createElement("td");//Rate
	td.innerHTML=promotion_code[x];
	tr.appendChild(td);
	td=document.createElement("td");//promo_start
	td.innerHTML=promo_start[x];
	tr.appendChild(td);
	td=document.createElement("td");//promo_due
	td.innerHTML=promo_due[x];
	tr.appendChild(td);

}

//show edit promo page for Admin
function open_edit_promo(){
	let edit_promo=document.getElementById("edit_promo");
	hidepage();
	document.getElementsByClassName("promo_tbody")[0].innerHTML="";
	edit_promo.removeAttribute("style");
	addOldPromo();
}

var i_scro=0;//scroll index
var left=800;//scroll width

//home page pictures scrolling, hold on when the page div displayed none
$(document).ready(function() {
	let hold = 550;
	let scrollDiv = document.getElementById("scroll_div");
	let list = document.getElementsByClassName("scroll_pic");
	let b_list= document.getElementsByClassName("scroll_botton");
	let num = list.length;
	let timer = setInterval(function() {
		if(document.getElementById("content").getAttribute("style")=="display: none;")//hold on when the page div displayed none
		{
			let temp=setInterval(function(){},10000);
			if(document.getElementById("content").getAttribute("style")=="display: block;")
			{
				clearInterval(temp);
			}
		}
		if(b_list[1].getAttribute("title")=="clicking")//move to next when clicking right arrow
		{
			hold=0;
			b_list[1].removeAttribute("title");
		}
		if(b_list[0].getAttribute("title")=="clicking")//move to previous when clicking left arrow
		{
			if(hold!=0)
			{
				let right=0;
				let temp2=setInterval(function(){
					right += 20;
					list[i_scro].setAttribute("style", "width:" + right + "px;");
					list[i_scro+1].setAttribute("style", "width:" + (800-right) + "px;");
					if(right==800)
					{
						list[i_scro+1].removeAttribute("style");
						clearInterval(temp2);
					}
			    },1);
			
			i_scro--;
			b_list[0].removeAttribute("title");
			hold=550;
			}
		}
		if(hold == 0) {
			left -= 20;
			if(i_scro == num - 1) {
				for(let k = 0; k < num; k++) {
					list[k].setAttribute("style", "width:" + left + "px;");
				}
				i_scro = 0;
				left = 800;
				hold = 550;
			}
		} else {
			hold -= 1;
		}
		list[i_scro].setAttribute("style", "width:" + left + "px;");
		if(left == 0) {
			left = 800;
			hold = 550;
			i_scro += 1;
		}
	}, 15);
});

window.onload=function(){
	document.getElementById("screen_div").setAttribute("style","margin:0 auto;");
	document.getElementById("Promo_Codes").addEventListener("click",open_view_promo);
	document.getElementById("cart_div").setAttribute("style","overflow: hidden auto;display: block;display: none;");
	getItemDB();
};

//get Item Info from DB
function getItemDB(){
	$.ajax({
		type: "post",
		url: "addItem.php",
		dataType: "json",
		success: function(msg) {
			item_names=msg.name.substring(0,msg.name.length-1).split(",");
			item_pics=msg.pic.substring(0,msg.pic.length-1).split(",");
			item_price=msg.price.substring(0,msg.price.length-1).split(",");
			item_InStock=msg.instock.substring(0,msg.instock.length-1).split(",");
			item_Vprice=msg.vprice.substring(0,msg.vprice.length-1).split(",");
			item_sellers=msg.seller.substring(0,msg.seller.length-1).split(",");
			item_descrips=msg.des.substring(0,msg.des.length-1).split(",");
	},
		error: function(msg) {
		}
	});
}

//click right scroll button
function sc_right(){
	let butt=document.getElementsByClassName("scroll_botton")[1];
	butt.setAttribute("title","clicking");
}

//click left scroll button
function sc_left(){
	if(i_scro==0)
	{
		return;
	}
	let butt=document.getElementsByClassName("scroll_botton")[0];
	butt.setAttribute("title","clicking");
}

//search the items with specific words and show
function show_search()
{
	search=document.getElementById("search");
	hidepage();
	search.removeAttribute("style");
}

//open search result page
function open_search()
{
	show_search();
	add_search_items(document.getElementsByClassName("nav_search_input")[0].value);
	document.getElementsByClassName("nav_search_input")[0].value="";
}

//add search items to search page when click the search button
//if there have items already on search page, remove them then add new search items
function add_search_items(val){
	let bigpage=document.getElementById("search");
	bigpage.removeChild(bigpage.lastElementChild);
	newDiv=document.createElement("div");
	newDiv.setAttribute("id","search_items");
	search.appendChild(newDiv);
	let num=item_names.length;
	let search_page=document.getElementById("search_items");
	for(let i=0;i<num;i++)
	{
		if(item_names[i].toUpperCase().indexOf(val.toUpperCase())!=-1)
		{
		let item_div=document.createElement("div");
	    item_div.setAttribute("class","item_div");
	    let pic=document.createElement("img");
	    pic.setAttribute("src",item_pics[i]);
	    pic.setAttribute("alt",i);//set the index in item list for finding its details again when click it
	    let pic_div=document.createElement("div");
	    modifyPic(pic,408,330);
	    pic.addEventListener("click",function(){open_item(pic);});
	    pic_div.appendChild(pic);
	    item_div.appendChild(pic_div);
	    var span=document.createElement("span");
	    let iname=document.createTextNode(item_names[i]);
	    span.appendChild(iname);
	    span.setAttribute("class","item_name");
	    span.addEventListener("click",function(){open_item(pic);});
	    item_div.appendChild(span);
	    var span=document.createElement("span");
	    let seller=document.createTextNode("by "+item_sellers[i]);
	    span.appendChild(seller);
	    span.setAttribute("class","item_seller");
	    item_div.appendChild(span);
	    let div=document.createElement("div");
	    let price_sign=document.createTextNode("$");
	    var sup=document.createElement("sup");
	    sup.appendChild(price_sign);
	    div.appendChild(sup);
	    let price_digit=document.createTextNode(item_price[i].substring(item_price[i].length-2));
	    let price_int=document.createTextNode(item_price[i].substring(0,item_price[i].length-3));
	    var sup=document.createElement("sup");
	    sup.appendChild(price_digit);
	    div.appendChild(price_int);
	    div.appendChild(sup);
	    div.setAttribute("class","item_price");
	    item_div.appendChild(div);
	    search_page.appendChild(item_div);
	    }
	}
}

//back to search page or home page
function back_result()
{
	if(document.getElementById("search_items").childElementCount==0)
	{
		show_home();
	}
	else
	{
		show_search();
	}
	clear_item_page();
}

function clear_item_page()
{
	document.getElementById("item_img").innerHTML="";
	document.getElementById("item_option_up").innerHTML="";
	document.getElementById("list_price").innerHTML="";
	document.getElementById("VIP_price").innerHTML="";
	document.getElementById("save_price").innerHTML="";
	document.getElementById("item_details").innerHTML="";
	document.getElementById("color_type").innerHTML="";
	document.getElementById("item_size").innerHTML="";
	document.getElementById("buy_num_entered").value=1;
	document.getElementById("get_promtion").innerHTML="get the promotion code";
	document.getElementById("get_promtion").removeAttribute("title");
	document.getElementById("get_promtion").removeAttribute("style");
}

//make a new item page for the specific item with all details and hide other pages
function open_item(pic){
	item_page=document.getElementById("item_page");
	hidepage();
	item_page.removeAttribute("style");
	addItemDetail(pic);
}

//add details to item page
function addItemDetail(pic){
	let src=pic.getAttribute("src");
	let i=pic.getAttribute("alt");
	let img_div=document.getElementById("item_img");
	let img=document.createElement("img");
	img.setAttribute("src",src);
	img.setAttribute("alt",i);
	modifyPic(img,650,650);
	img_div.appendChild(img);
	let item_option=document.getElementById("item_option_up");
	let title=document.createElement("p");
	title.innerHTML=item_names[i];
	item_option.appendChild(title);
	let seller=document.createElement("p");
    seller.innerHTML="by <span>"+item_sellers[i]+"</span>";
    item_option.appendChild(seller);
    let span=document.createElement("span");
    addItemPrice(i);
    addItemOptions(i);
}

//add the purchase options of the item (color & size)
function addItemOptions(i)
{
	let ul=document.createElement("ul");
	let color=document.getElementById("color_type");
	color.appendChild(ul);
	let list=item_colors[i];
	for(let t=0;t<list.length;t++)
	{
		let img=document.createElement("img");
		img.setAttribute("src",list[t]);
		let li=document.createElement("li");
		li.appendChild(img);
		li.addEventListener("click",function(){switchChange(li,"class");});
		ul.appendChild(li);
	}
	ul=document.createElement("ul");
	let size=document.getElementById("item_size");
	size.appendChild(ul);
	list=["One Standard Pack"];
	for(let t=0;t<list.length;t++)
	{
		let li=document.createElement("li");
		li.innerHTML=list[t];
		ul.appendChild(li);
		li.addEventListener("click",function(){switchChange(li,"class");});
	}
	let span=document.getElementById("buy_quantity").lastElementChild.firstElementChild;
	span.innerHTML=item_InStock[i];
}
	
function switchChange(e,attr)
{
	if(e.getAttribute(attr)==undefined)
	{
		e.setAttribute(attr,"selected");
	}
	else
	{
		e.removeAttribute(attr);
	}
}

//add the promocode to user account
function addUserPromo(i)
{
	if(signIn==false)//guest
	{
		let temp=false;
		guest_promo_list.forEach(function(x){if(x==i){temp=true;return;}});
		if(temp==false)
		{
		    guest_promo_list.push(i/1);
		}
	}
	else if(signAdmin==false)//reg account
	{
		let temp=false;
		user_promo_list[accountIndex].forEach(function(x){if(x==i){temp=true;return;}});
		if(temp==false)
		{
		    user_promo_list[accountIndex].push(i/1);
		}
		AddPromoUserDB();
	}
}

//add promo to user account in DB
function AddPromoUserDB(){
	let email=Email;
	let plist="";
	for(let i=0;i<user_promo_list[0].length;i++)
	{
		plist+=user_promo_list[0][i]/1+1;
		plist+=" ";
	}
	$.ajax({
		type: "post",
		url: "addPromoUser.php",
		data: {
			email: email,
			promo: plist
		},
		dataType: "json",
		success: function(msg) {
	},
		error: function(msg) {
		}
	});
}

//show posted promocode to customer and add to account
function get_promocode(event)
{
	if(event.target.title!="show")
	{
		update_getPromoDB();
		let i=document.getElementById("item_img").firstElementChild.getAttribute("alt");
		if(promotion_code[i]!="0"&&dateCheck(promo_due[i])==true)
		{
			event.target.innerHTML="Congratulations, you get a "+promotion_code[i]+"% off promotion code!";
			event.target.setAttribute("title","show");
			event.target.setAttribute("style","color: gold;font-size:0.8em")
			addUserPromo(i);//add the promocode to user account
		}
		else
		{
			event.target.innerHTML="Sorry, there is no available promotion code now";
			event.target.setAttribute("title","show");
		}
	}
}

//get Promo lists from DB
function update_getPromoDB(){
	$.ajax({
		type: "post",
		url: "fetchPromo.php",
		dataType: "json",
		success: function(msg) {
			promo_start=msg.start.substring(0,msg.start.length-1).split(",");
			promo_due=msg.due.substring(0,msg.due.length-1).split(",");
			promotion_code=msg.rate.substring(0,msg.rate.length-1).split(",");
	},
		error: function(msg) {
			console.log(msg)
		}
	});
}

//check whether the date is over today
function dateCheck(code)
{
	let d=new Date();
	let list=code.split("-");
	if(list[0]/1<d.getFullYear())
	{
		return false;
	}
	else if(list[1]/1<d.getMonth()+1)
	{
		if(list[0]/1>d.getFullYear())
		{
			return true;
		}
		return false;
	}
	else if(list[2]/1<d.getDate())
	{
		if(list[0]/1>d.getFullYear())
		{
			return true;
		}
		if(list[1]/1>d.getMonth()+1)
		{
			return true;
		}
		return false;
	}
	return true;
}

//add the price of ith item in database to ItemDetial
function addItemPrice(i)
{
    document.getElementById("list_price").innerHTML="$"+item_price[i];
	document.getElementById("VIP_price").innerHTML="$"+item_Vprice[i];
	let d=price_modify(item_price[i]-item_Vprice[i]);
	document.getElementById("save_price").innerHTML="$"+d+" ("+price_modify(d/item_price[i])*100+"%)";
}

//modify the price to 2 digit
function price_modify(d)
{
	let temp=d*100;
	temp=Math.round(temp);
	temp=temp/100+"";
	if(temp.substring(temp.length-2,temp.length-1)=='.')
	{
		temp=temp+"0";
	}
	return temp;
}

//modify the picture to width<=wmax px height<=hmax px
function modifyPic(pic,wmax,hmax){
	if(pic.width/pic.height > wmax/hmax)//margin top and button
	{
		let h=wmax*pic.height/pic.width;
		let m=(hmax-h)/2;
		pic.setAttribute("style","margin-top:"+ m +"px;cursor:pointer;");
	}
	else//margin left and right
	{
		let w=hmax*pic.width/pic.height;
		let m=(wmax-h)/2;
		pic.setAttribute("style","margin-left:"+ m +"px;cursor:pointer;");
	}
}

//change account description to register type
function changeAccount_RE()
{
	document.getElementById("your_orders").firstElementChild.nextElementSibling.innerHTML="Your Orders";
	document.getElementById("VELZ's_VIP").firstElementChild.setAttribute("src","img/vip.png");
	document.getElementById("your_orders").lastElementChild.innerHTML="Track, return, or buy things again";
	document.getElementById("your_orders").removeEventListener("click",admin_order);
	document.getElementById("your_orders").addEventListener("click",show_order);
	document.getElementById("VELZ's_VIP").firstElementChild.nextElementSibling.innerHTML="VELZ's VIP";
	document.getElementById("VELZ's_VIP").lastElementChild.innerHTML="View benefit and payment settings";
	document.getElementById("VELZ's_VIP").removeEventListener("click",open_warehouse);
	document.getElementById("payment_options").firstElementChild.nextElementSibling.innerHTML="Payment Options";
	document.getElementById("payment_options").lastElementChild.innerHTML="Edit or add payment methods";
	document.getElementById("Promo_Codes").lastElementChild.innerHTML="View your promotion codes";
	document.getElementById("Promo_Codes").removeEventListener("click",open_edit_promo);
	document.getElementById("Promo_Codes").addEventListener("click",open_view_promo);
}

//show admin order page
function admin_order(){
	admin_order=document.getElementById("admin_order");
	hidepage();
	admin_order.setAttribute("style","display: block;");
}

//sign out the current user and back to home
function sign_out(){
	signIn=false;
    signAdmin=false;
    accountIndex=-1;
    document.getElementById("order_table").lastElementChild.innerHTML="";
    document.getElementById("cart_table").innerHTML="";//cart clear
	document.getElementById("cart_total_price").innerHTML="0";
	document.getElementById("cart_num").innerHTML="0";
	show_home();
	changeAccount_RE();
	document.getElementById("sign_out").setAttribute("style","visibility: hidden;");
}

//change node's value by d and |d|=1
function change_val(node,d)
{
	if(d==-1)
	{
		if(node.value==1)
		{return;}
		node.value--;
	}
	else
	{
		if(node.value>=Number(node.nextElementSibling.nextElementSibling.firstElementChild.innerHTML))
		{return;}
		node.value++;
	}
}

//admin search promotions by item name
function searchPromo()
{
	document.getElementById("promo_name_Field").innerHTML="";
	let val=document.getElementById("search_promo_Field").value;
	document.getElementById("search_promo_Field").value="";
	let num=item_names.length;
	for(let i=0;i<num;i++)
	{
		if(item_names[i].toUpperCase().indexOf(val.toUpperCase())!=-1)
		{
			let opt=document.createElement("option");
			opt.innerHTML=item_names[i];
			opt.setAttribute("title",i);
			document.getElementById("promo_name_Field").appendChild(opt);
		}
	}
}

//search goods by character
function searchGoods(){
	document.getElementById("goods_name_Field").innerHTML="";
	let val=document.getElementById("search_goods_Field").value;
	document.getElementById("search_goods_Field").value="";
	let num=item_names.length;
	for(let i=0;i<num;i++)
	{
		if(item_names[i].toUpperCase().indexOf(val.toUpperCase())!=-1)
		{
			let opt=document.createElement("option");
			opt.innerHTML=item_names[i];
			opt.setAttribute("title",i);
			document.getElementById("goods_name_Field").appendChild(opt);
		}
	}
}

//delete the goods in database
function DeleteGoods(){
	let index=document.getElementById("goods_name_Field").selectedIndex;
	let i=document.getElementById("goods_name_Field").childNodes[index].title;
	let Iname=item_names[i];
	item_names.splice(i,1,);
	item_colors.splice(i,1,);
	item_pics.splice(i,1,);
	item_price.splice(i,1,);
	item_Vprice.splice(i,1,);
	item_sellers.splice(i,1,);
	item_InStock.splice(i,1,);
	promotion_code.splice(i,1,);
	promo_due.splice(i,1,);
	promo_start.splice(i,1,);
	document.getElementById("goods_name_Field").innerHTML="";
	remove_cart_delGoods(i);
	delGoodsDB(i,Iname);
}

//delete item in DB
function delGoodsDB(i,Iname){
	let itemName=Iname;
	$.ajax({
		type: "post",
		url: "deleteItem.php",
		data:{
			itemName: itemName
		},
		dataType: "json",
		success: function(msg) {
	},
		error: function(msg) {
		}
	});
	let email=Email;
	let move=i;
	$.ajax({
		type: "post",
		url: "updateCP.php",
		data: {
			email: email,
			move: move
		},
		dataType: "json",
		success: function(msg) {
	},
		error: function(msg) {
		}
	});
}

//update items' Id in userpromo
function update_promoId(i){
	let list=user_promo_list[0];
	for(let t=0;t<list.length;t++)
	{
		if(list[t]==i)
		{
			list.splice(t,1,);
		}
	}
	for(let t=0;t<list.length;t++)
	{
		if(list[t]>i)
		{
			list[t]=list[t]-1;
		}
	}
}

//update items' Id in cart
function update_cartId(i){
	let list=document.getElementById("cart_table").childNodes;
	for(let t=0;t<list.length;t+=2)
	{
		if(list[t].title>i)
		{
			list[t].title=list[t].title-1;
		}
	}
}

//remove item in cart when it's deleted by Admin
function remove_cart_delGoods(i){
	let list=document.getElementById("cart_table").childNodes;
	for(let t=0;t<list.length;t+=2)
	{
		if(list[t].title==i)
		{
			let tr=list[t];
	        let p=tr.childNodes[3].firstElementChild.innerHTML.substring(1);
	        tr.parentNode.removeChild(tr.nextElementSibling);
	        tr.parentNode.removeChild(tr);
	        document.getElementById("cart_num").innerHTML=document.getElementById("cart_num").innerHTML-1;
	        document.getElementById("cart_total_price").innerHTML=price_modify(document.getElementById("cart_total_price").innerHTML/1-p/1);
	        updateCartDB();
		}
	}
	
}

//create a row of promo of ith item and add to the table
function addPromoTr(name,rate,start,due,price,i)
{
	let tbody=document.getElementById("promo_table").lastElementChild;
	let tr=document.createElement("tr");
	tbody.appendChild(tr);
	tr.setAttribute("title",i);
	let td=document.createElement("td");//name
	let putin=document.createElement("input");
	putin.setAttribute("style","width: 550px;margin: 0px;");
	putin.setAttribute("type","text");
	putin.setAttribute("class","promo_form_input");
	putin.value=name;
	td.appendChild(putin);
	tr.appendChild(td);
	td=document.createElement("td");//rate
	let putinp=document.createElement("input");
	putinp.setAttribute("type","number");
	putinp.setAttribute("class","promo_form_input");
	putinp.setAttribute("style","width:60px;margin: 0px;")
	putinp.setAttribute("max","100");
	putinp.setAttribute("min","1");
	putinp.addEventListener("change",function(){change_discPrice(putinp,price);})
	td.appendChild(putinp);
	tr.appendChild(td);
	putinp.value=rate;
	promotion_code[i]=rate;
	td=document.createElement("td");//start_date
	putin=document.createElement("input");
	td.appendChild(putin);
	tr.appendChild(td);
	putin.setAttribute("type","date");
	putin.setAttribute("class","promo_form_input");
	putin.setAttribute("style","margin: 0px;")
	putin.value=start;
	promo_start[i]=start;
	td=document.createElement("td");//due_date
	putin=document.createElement("input");
	td.appendChild(putin);
	tr.appendChild(td);
	putin.setAttribute("type","date");
	putin.setAttribute("class","promo_form_input");
	putin.setAttribute("style","margin: 0px;")
	putin.value=due;
	promo_due[i]=due;
	td=document.createElement("td");//discont_price
	div=document.createElement("div");
	div.innerHTML="$"+price_modify(price*(1-rate/100))+" / $"+price;
	div.setAttribute("class","promo_form_input");
	div.setAttribute("style","margin: 0px;")
	td.appendChild(div);
	tr.appendChild(td);
	td=document.createElement("td");//delete
	let butt=document.createElement("input");
	butt.setAttribute("type","button");
	butt.setAttribute("value","x");
	butt.setAttribute("class","promo_form_input");
	td.setAttribute("style","padding-left: 20px;")
	td.appendChild(butt);
	tr.appendChild(td);
}

function change_discPrice(node,price)
{
	rate=node.value;
	node.parentNode.nextElementSibling.nextElementSibling.firstChild.innerHTML="$"+price_modify(price*(1-rate/100));
}

//add old promo code to the table
function addOldPromo()
{
	for(let i=0;i<promotion_code.length;i++)
	{
		if(promo_due[i]!="")
		{
			addPromoTr(item_names[i],promotion_code[i],promo_start[i],promo_due[i],item_price[i],i);
		}
	}
}

//add new promo code to the table
function addNewPromo()
{
	let index=document.getElementById("promo_name_Field").selectedIndex;
	let i=document.getElementById("promo_name_Field").childNodes[index].title;
	let list=document.getElementsByClassName("promo_tbody")[0].childNodes;
	list.forEach(function(x){if(x.title==i){x.parentNode.removeChild(x);}});
	addPromoTr(item_names[i],document.getElementById("promo_rate_field").value,document.getElementById("startField").value,document.getElementById("dueField").value,item_price[i],i);
    update_PromoDB(i/1+1,document.getElementById("promo_rate_field").value,document.getElementById("startField").value,document.getElementById("dueField").value);
}

//admin add or update promo Info to DB
function update_PromoDB(index,rate,start,due){
	$.ajax({
		type: "post",
		url: "updatePromo.php",
		data: {
			index: index,
			rate: rate,
			start: start,
			due: due
		},
		dataType: "json",
		success: function(msg) {
	},
		error: function(msg) {
		}
	});
}

//open checkout page
function open_checkout()
{
	checkingcart=false;
	checkout=document.getElementById("checkout_page");
	hidepage();
	checkout.removeAttribute("style");
}

//go check out the specific item
function buynow()
{
	let i=document.getElementById("item_img").firstElementChild.alt;
	let quantity=document.getElementById("buy_num_entered").value;
	open_checkout();
	clearCheckInfo();
	clearAddress();
	addCheckItemTr(i,quantity);
}


function clearAddress()
{
	document.getElementById("checkaddr_name").value="";
	document.getElementById("checkaddr_addr1").value="";
	document.getElementById("checkaddr_addr2").value="";
	document.getElementById("checkaddr_city").value="";
	document.getElementById("checkaddr_state").value="";
	document.getElementById("checkaddr_zip").value="";
	document.getElementById("checkaddr_country").value="";
	document.getElementById("checkaddr_phone").value="";
}


//clear the Info in check page
function clearCheckInfo()
{
	document.getElementById("checkitem_table").lastElementChild.innerHTML="";
	document.getElementsByClassName("finalprice")[0].innerHTML="0";
	document.getElementsByClassName("finalprice")[1].innerHTML="";
	document.getElementsByClassName("finalprice")[2].innerHTML="";
	document.getElementById("checkout_payment").setAttribute("style","display: none;");
}

//add a row of ith item to checkItem table
function addCheckItemTr(i,quantity)
{
	let Prate=0;
	let tbody=document.getElementById("checkitem_table").lastElementChild;
	let tr=document.createElement("tr");
	tbody.appendChild(tr);
	tr.setAttribute("class","checkbodyRow");
	let td=document.createElement("td");
	tr.appendChild(td);
	let div=document.createElement("div");
	div.innerHTML=item_names[i];
	td.appendChild(div);
	td=document.createElement("td");//quantity
	let putin=document.createElement("input");
	putin.setAttribute("class","checkout_quantity");
	td.appendChild(putin);
	tr.appendChild(td);
	putin.value=quantity;
	td=document.createElement("td");//select
	let sel=document.createElement("select");
	sel.addEventListener("change",function(){onselectPromoPrice(event,i);});
	td.appendChild(sel);
	tr.appendChild(td);
	let optn=document.createElement("option");
	optn.setAttribute("title","0");
	optn.innerHTML="Do not use promotions";
	sel.appendChild(optn);
	if(signIn==false)
	{
		for(let t=0;t<guest_promo_list.length;t++)
		{
			if(guest_promo_list[t]==i&&dateCheck(promo_start[i])==false&&dateCheck(promo_due[i])==true)//have promo for ith item and available
			{
				let opt=document.createElement("option");
				opt.setAttribute("title",opt.innerHTML=promotion_code[i]);
				opt.innerHTML=promotion_code[i]+"% off promotion code of this item";
				sel.appendChild(opt);
			}
		}
	}
	else
	{
		for(let t=0;t<user_promo_list[accountIndex].length;t++)
		{
			if(user_promo_list[accountIndex][t]==i&&dateCheck(promo_start[i])==false&&dateCheck(promo_due[i])==true)//have promo for ith item and available
			{
				let opt=document.createElement("option");
				opt.innerHTML=promotion_code[i]+"% off promotion code";
				opt.setAttribute("title",promotion_code[i]);
				sel.appendChild(opt);			}
		}
		if(reg_accounts[accountIndex][5]=="1")//this account is VIP
		{
			let opt=document.createElement("option");
			opt.setAttribute("title","*");
			opt.innerHTML="Use your VIP membership";
			sel.appendChild(opt);
		}
	}
	td=document.createElement("td");
	div=document.createElement("div");
	td.appendChild(div);
	tr.appendChild(td);
	mod_price=price_modify(item_price[i]*quantity);
	div.innerHTML="$"+mod_price;
	let total_price=price_modify(document.getElementsByClassName("finalprice")[0].innerHTML/1+mod_price/1);
	document.getElementsByClassName("finalprice")[0].innerHTML=total_price;
	let tax=document.getElementById("tax_div").title;
	let mod_tax=price_modify(total_price*(tax/100));
	document.getElementsByClassName("finalprice")[1].innerHTML=mod_tax;
	document.getElementsByClassName("finalprice")[2].innerHTML=price_modify(mod_tax/1+total_price/1);
}

//apply promotion on check out price
function onselectPromoPrice(event,i)
{
	let quantity=event.target.parentNode.previousElementSibling.firstElementChild.value;
	let index=event.target.selectedIndex;
	let rate=event.target.childNodes[index].title;
	let pricenode=event.target.parentNode.nextElementSibling.firstElementChild;
	let origin_price=pricenode.innerHTML.substring(1);
	let mod_price=0;
	if(rate=="*")//VIP price
	{
		mod_price=price_modify(item_Vprice[i]*quantity);
	}
	else
	{
		mod_price=price_modify(item_price[i]*quantity*(1-Number(rate)/100));
	}
    pricenode.innerHTML="$"+mod_price;
    let total_price=price_modify(document.getElementsByClassName("finalprice")[0].innerHTML/1+mod_price/1-origin_price/1);
	document.getElementsByClassName("finalprice")[0].innerHTML=total_price;
	let tax=document.getElementById("tax_div").title;
	let mod_tax=price_modify(total_price*(tax/100));
	document.getElementsByClassName("finalprice")[1].innerHTML=mod_tax;
	document.getElementsByClassName("finalprice")[2].innerHTML=price_modify(mod_tax/1+total_price/1);
}

function addNavCart(i,quantity)
{
	let table=document.getElementById("cart_table");
	let tr=document.createElement("tr");
	table.appendChild(tr);
	tr.setAttribute("title",i);
	let td=document.createElement("td");//item pic
	let img=document.createElement("img");
	img.setAttribute("src",item_pics[i]);
	td.appendChild(img);
	img.setAttribute("style","width:100px;");
	img.setAttribute("title",item_names[i]);
	tr.appendChild(td);
	td=document.createElement("td");//item name
	let div=document.createElement("div");
	div.innerHTML=item_names[i];
	if(item_names[i].length>24){
		div.innerHTML=item_names[i].substring(0,24)+"...";
	};
	div.setAttribute("title",item_names[i]);
	td.appendChild(div);
	tr.appendChild(td);
	td=document.createElement("td");//item quantity
	divq=document.createElement("div");
	if(quantity==0)
	{
		divq.innerHTML=document.getElementById("buy_num_entered").value;
	}
	else
	{
		divq.innerHTML=quantity;
	}
	let putin=document.createElement("input");
	putin.addEventListener("click",function(){cart_rowPrice(tr,-1);});
	putin.value="-";
	putin.setAttribute("title","minus");
	putin.type="button";
	td.appendChild(putin);
	td.appendChild(divq);
	putin=document.createElement("input");
	putin.addEventListener("click",function(){cart_rowPrice(tr,1);});
	putin.value="+";
	putin.setAttribute("title","add");
	putin.type="button";
	td.appendChild(putin);
	tr.appendChild(td);
	td=document.createElement("td");//item price
	div=document.createElement("div");
	let p=price_modify(item_price[i]*(document.getElementById("buy_num_entered").value));
	div.innerHTML="$"+p;
	td.appendChild(div);
	tr.appendChild(td);
	div=document.createElement("div");//del_button
	div.setAttribute("style","visibility: hidden;");
	div.setAttribute("title","delete");
	tr.onmouseover=(function(event){tr.lastElementChild.lastElementChild.removeAttribute("style");});
	tr.onmouseleave=(function(event){tr.lastElementChild.lastElementChild.setAttribute("style","visibility: hidden;");});
	div.addEventListener("click",function(){del_cart_row(event);});
	div.setAttribute("class","del_button")
	td.appendChild(div);
	div=document.createElement("div");
	div.setAttribute("style","height: 23px;")
	table.appendChild(div);
	document.getElementById("cart_total_price").innerHTML=price_modify(document.getElementById("cart_total_price").innerHTML/1+p/1);
}

//delete a row in the cart
function del_cart_row(event)
{
	let tr=event.target.parentNode.parentNode;
	let p=tr.childNodes[3].firstElementChild.innerHTML.substring(1);
	tr.parentNode.removeChild(tr.nextElementSibling);
	tr.parentNode.removeChild(tr);
	document.getElementById("cart_num").innerHTML=document.getElementById("cart_num").innerHTML-1;
	document.getElementById("cart_total_price").innerHTML=price_modify(document.getElementById("cart_total_price").innerHTML/1-p/1);
	updateCartDB();
}

//change the price in nav cart when quantity change
function cart_rowPrice(tr,change)
{
	let quantity=tr.childNodes[2].childNodes[1];
	let q=quantity.innerHTML;
	if(q/1+change<=0){return;}
	quantity.innerHTML=q/1+change;
	let unitP=item_price[tr.title];
	tr.childNodes[3].firstElementChild.innerHTML="$"+price_modify((q/1+change)*(unitP/1));
	let p=price_modify((change)*(unitP/1));
	document.getElementById("cart_total_price").innerHTML=price_modify(document.getElementById("cart_total_price").innerHTML/1+p/1);
	updateCartDB();
}

//add items to cart
function addcart()
{
	let hasItem=false;
	let cartnumNode=document.getElementById("cart_num");
	cartnumNode.setAttribute("style","font-size: x-large;");
	setTimeout(function(){cartnumNode.removeAttribute("style");},500);
	let i=document.getElementById("item_img").firstElementChild.getAttribute("alt");
	let list=document.getElementById("cart_table").childNodes;
	for(let t=0;t<list.length;t+=2)
	{
		if(list[t].title==i)
		{
			let unitP=item_price[list[t].title];
			list[t].childNodes[2].childNodes[1].innerHTML=list[t].childNodes[2].childNodes[1].innerHTML/1+document.getElementById("buy_num_entered").value/1;
			list[t].childNodes[3].firstElementChild.innerHTML="$"+price_modify((unitP/1)*(list[t].childNodes[2].childNodes[1].innerHTML/1));
			let p=price_modify((unitP/1)*(document.getElementById("buy_num_entered").value/1));
			document.getElementById("cart_total_price").innerHTML=price_modify(document.getElementById("cart_total_price").innerHTML/1+p/1);
			hasItem=true;
			break;
		}
	}
	if(hasItem==false)
	{
		cartnumNode.innerHTML=cartnumNode.innerHTML/1+1;
		addNavCart(i,0);
	}
	if(signIn==true)
	{
		updateCartDB();
	}
}

function updateCartDB()
{
	let email=Email;
	let clist="";
	let list=document.querySelectorAll("#cart_table>tr");
	for(let i=0;i<list.length;i++)
	{
		let temp="";
		temp+=list[i].title/1+1;
		temp+=" ";
		temp+=list[i].childNodes[2].childNodes[1].innerHTML/1;
		temp+=",";
		clist+=temp;;
	}
	$.ajax({
		type: "post",
		url: "addedToCart.php",
		data: {
			email: email,
			cart: clist
		},
		dataType: "json",
		success: function(msg) {
	},
		error: function(msg) {
		}
	});
}

//add cart from DB
function addcartFromDB(i,quantity)
{
	let hasItem=false;
	let cartnumNode=document.getElementById("cart_num");
	cartnumNode.setAttribute("style","font-size: x-large;");
	setTimeout(function(){cartnumNode.removeAttribute("style");},500);
	let list=document.getElementById("cart_table").childNodes;
	for(let t=0;t<list.length;t+=2)
	{
		if(list[t].title==i)
		{
			let unitP=item_price[list[t].title];
			list[t].childNodes[2].childNodes[1].innerHTML=list[t].childNodes[2].childNodes[1].innerHTML/1+quantity/1;
			list[t].childNodes[3].firstElementChild.innerHTML="$"+price_modify((unitP/1)*(list[t].childNodes[2].childNodes[1].innerHTML/1));
			let p=price_modify((unitP/1)*(document.getElementById("buy_num_entered").value/1));
			document.getElementById("cart_total_price").innerHTML=price_modify(document.getElementById("cart_total_price").innerHTML/1+p/1);
			hasItem=true;
			break;
		}
	}
	if(hasItem==false)
	{
		cartnumNode.innerHTML=cartnumNode.innerHTML/1+1;
		addNavCart(i,quantity);
	}
	
}

//clear items in the cart
function clear_cart()
{
	document.getElementById("cart_table").innerHTML="";
	document.getElementById("cart_total_price").innerHTML="0";
	document.getElementById("cart_num").innerHTML="0";
	updateCartDB();
}

//go to checkout from cart
function cartCkeck()
{
	if(document.getElementById("cart_num").innerHTML=="0")
	{
		return;
	}
	open_checkout();
	clearCheckInfo();
	clearAddress();
	for(let t=0;t<document.getElementById("cart_num").innerHTML/1;t++)
	{
		let tr=document.getElementById("cart_table").childNodes[2*t];
		let i=tr.title;
	    let quantity=tr.childNodes[2].childNodes[1].innerHTML/1;
	    addCheckItemTr(i,quantity);
	}
	$("#cart_div").css("display","none");
	checkingcart=true;
}

//go to pay from checkout page
function go_pay()
{
	if(check_payment()==false)
	{
		document.getElementById("checkout_payment").lastElementChild.removeAttribute("style");
		return;
	}
	clearOrder();
	let list=document.getElementsByClassName("checkbodyRow");
	for(let t=0;t<list.length;t++)
	{
		update_Order_Data(list[t]);
	}
	order.forEach(function(x){addOrderRow(x);});
	show_order();
	PayDiv_toggle();
	if(checkingcart==true)
	{
		clear_cart();
	}
}

//check user has select at least one payment option
function check_payment()
{
	let flag=false;
	let list=document.getElementsByClassName("card_checkbox");
	for(let i=0;i<list.length;i++)
	{
		if(list[i].checked==true)
		{
			flag=true;
		}
	}
	return flag;
}

//clear the order page for re-add the rows
function clearOrder()
{
	document.getElementById("order_table").lastElementChild.innerHTML="";
}

//open the orders Info page
function show_order()
{
	content=document.getElementById("order_page");
	document.getElementById("order_table").firstElementChild.nextElementSibling.innerHTML="";
	hidepage();
	content.setAttribute("style","display: block;");
	order.forEach(function(x){addOrderRow(x);});
}

//get row by select email push to order
function getOrderHistoryDB(){
	email=Email;
	$.ajax({
		type: "post",
		url: "getOrderHis.php",
		data: {
			email: email
		},
		dataType: "json",
		success: function(msg) {
			console.log(msg);
			msg=msg.str.substring(0,msg.str.length-1);
			let list=msg.split(";");
			list.forEach(function(x){
				let arr=x.substring(0,x.length-1).split(",");
				order.unshift(arr);
			})
	},
		error: function(msg) {
		}
	});
}

//update order data to database
function update_Order_Data(row)
{
	let name=row.childNodes[0].firstElementChild.innerHTML;
	let quantity=row.childNodes[1].firstElementChild.value;
	let sel=row.firstElementChild.nextElementSibling.nextElementSibling.firstElementChild;
	let promo=sel.childNodes[sel.selectedIndex].title;
	let price=row.lastElementChild.firstElementChild.innerHTML;
	let day=new Date().getFullYear()+"-"+new Date().getMonth()+"-"+new Date().getDate();
	let arr=new Array(name,quantity,promo,price,day,"To be shipped");
	order.unshift(arr);
	let str="";
	let addr=getAddress();
	str=str+name+","+quantity+","+promo+","+price+","+day+","+addr;
	update_OrderDB(str);
}

function update_OrderDB(str)
{
	email=Email;
	$.ajax({
		type: "post",
		url: "orderHistory.php",
		data: {
			email: email,
			str: str
		},
		dataType: "json",
		success: function(msg) {
	},
		error: function(msg) {
		}
	});
}

function getAddress()
{
	let addr=document.getElementById("checkaddr_name").value+" ";
	addr=addr+document.getElementById("checkaddr_addr1").value+" ";
	addr=addr+document.getElementById("checkaddr_addr2").value+" ";
	addr=addr+document.getElementById("checkaddr_city").value+" ";
	addr=addr+document.getElementById("checkaddr_state").value+" ";
	addr=addr+document.getElementById("checkaddr_zip").value+" ";
	addr=addr+document.getElementById("checkaddr_country").value+" ";
	addr=addr+document.getElementById("checkaddr_phone").value;
	return addr;
}

//add a row of order data to order Info page
function addOrderRow(list)
{
	let tbody=document.getElementById("order_table").lastElementChild;
	let tr=document.createElement("tr");
	let td=document.createElement("td");
	let div=document.createElement("div");
	tbody.appendChild(tr);
	tr.appendChild(td);
	td.appendChild(div);
	div.innerHTML=list[0];
	td=document.createElement("td");
	div=document.createElement("div");
	tr.appendChild(td);
	td.appendChild(div);
	div.innerHTML=list[1];
	td=document.createElement("td");
	div=document.createElement("div");
	tr.appendChild(td);
	td.appendChild(div);
	if(list[2]==0)
	{
		div.innerHTML="No promotions";
	}
	else if(list[2]=="*")
	{
		div.innerHTML="VIP price";
	}
	else
	{
		div.innerHTML=list[2]+"% off promotion";
	}
	td=document.createElement("td");
	div=document.createElement("div");
	tr.appendChild(td);
	td.appendChild(div);
	div.innerHTML=list[3];
	td=document.createElement("td");
	div=document.createElement("div");
	tr.appendChild(td);
	td.appendChild(div);
	div.innerHTML=list[4];
	td=document.createElement("td");
	div=document.createElement("div");
	tr.appendChild(td);
	td.appendChild(div);
	div.innerHTML="To be shipped";
	td=document.createElement("td");
	let putin=document.createElement("input");
	tr.appendChild(td);
	td.appendChild(putin);
	putin.setAttribute("type","button");
	putin.setAttribute("class","order_edit");
	putin.value="edit";
}

//change the display of payDiv
function PayDiv_toggle()
{
	let pay=document.getElementById("checkout_payment");
	let rowcount=document.getElementById("payment_table").lastElementChild.childNodes.length;
	let h=320+rowcount*40;
	if(pay.getAttribute("style")=="display: none;")
	{
		pay.setAttribute("style","display: block;height: "+h+"px;");
	}
	else
	{
		pay.setAttribute("style","display: none;");
	}
}

//update user's' data in payment div and open the div
function update_pay_div()
{
	document.getElementById("payment_table").lastElementChild.innerHTML="";
	payment_card.forEach(function(x){addPaymentRow(x);});
	addyear();
	document.getElementById("check_card_name").value="";
	document.getElementById("check_card_num").value="";
	document.getElementById("checkout_payment").lastElementChild.setAttribute("style","display: none;");
	PayDiv_toggle();
}

//click all other checkbox's again
function clickcheck(event)
{
	let list=document.getElementsByClassName("card_checkbox");
	for(let i=0;i<list.length;i++)
	{
		list[i].checked=false;
	}
	event.target.checked=true;
}

//add card info to payment option table
function addPaymentRow(list)
{
	let tbody=document.getElementById("payment_table").lastElementChild;
	let tr=document.createElement("tr");
	tbody.appendChild(tr);
	let td=document.createElement("td");
	tr.appendChild(td);
	let putin=document.createElement("input");
	td.appendChild(putin);
	putin.setAttribute("type","checkbox");
	putin.setAttribute("class","card_checkbox");
	putin.addEventListener("click",function(){clickcheck(event);});
	if(list[0].substring(0,1)=="V")
	{
		let div=document.createElement("div");
		div.innerHTML="Visa ";
		td.appendChild(div);
	}
	else
	{
		let div=document.createElement("div");
		div.innerHTML="Debit ";
		td.appendChild(div);
	}
	let div=document.createElement("div");
	div.innerHTML="endding in "+list[0].substring(list[0].length-4);
	td.appendChild(div);
	for(let i=1;i<3;i++)
	{
		let td=document.createElement("td");
		let div=document.createElement("div");
		div.innerHTML=list[i];
		td.appendChild(div);
		tr.appendChild(td);
	}
}

//add year options to the select tag
function addyear()
{
	let sel=document.getElementById("card_year");
	sel.innerHTML="";
	let year=new Date().getFullYear();
	for(let i=0;i<10;i++)
	{
		let opt=document.createElement("option");
		opt.innerHTML=year+i;
		sel.appendChild(opt);
	}
	sel=document.getElementById("card_month");
	sel.innerHTML="";
	for(let i=1;i<13;i++)
	{
		let opt=document.createElement("option");
		if(i<10){i="0"+i;}
		opt.innerHTML=i;
		sel.appendChild(opt);
	}
}

//add new card to payment table
function addcard(event)
{
	let name=document.getElementById("check_card_name").value;
	let cardnum=document.getElementById("check_card_num").value;
	let sel=document.getElementById("check_card_type");
	if(sel.selectedIndex==0)
	{
		cardnum="V"+cardnum;
	}
	else
	{
		cardnum="D"+cardnum;
	}
	sel=document.getElementById("Card_field").lastElementChild.previousElementSibling.lastElementChild.previousElementSibling;
	let month=sel.childNodes[sel.selectedIndex].innerHTML;
	sel=document.getElementById("Card_field").lastElementChild.previousElementSibling.lastElementChild;
	let year=sel.childNodes[sel.selectedIndex].innerHTML;
	let list=[cardnum,name,month+"/"+year];
	addPaymentRow(list);
	payment_card.unshift(list);
	let rowcount=document.getElementById("payment_table").lastElementChild.childNodes.length;
	let h=320+rowcount*40;
	document.getElementById("checkout_payment").setAttribute("style","display: block;height: "+h+"px;");
	updateCard();
}

function updateCard()
{
	let list=payment_card;
	let str="";
	for(let i=0;i<list.length;i++)
	{
		for(let j=0;j<list[i].length;j++)
		{
			if(j!=list[i].length-1)
			{
				str=str+list[i][j]+',';
			}
			else
			{
				str=str+list[i][j];
			}
		}
		str=str+";";
	}
	let email=Email;
	$.ajax({
		type: "post",
		url: "storeCard.php",
		data: {
			email: email,
			str: str
		},
		dataType: "json",
		success: function(msg) {
	},
		error: function(msg) {
		}
	});
}

//update the goods in Database
function update_goodsDB(){
	let name=document.getElementById("update_goods_name").value;
	let price=document.getElementById("update_goods_price").value;
	let vprice=document.getElementById("update_goods_Vprice").value;
	let pic=document.getElementById("update_goods_pic").value;
	let stock=document.getElementById("update_goods_instock").value;
	let des=document.getElementById("update_goods_des").value;
	let seller=document.getElementById("update_goods_seller").value;
	$.ajax({
		type: "post",
		url: "updateOldItem.php",
		data: {
			name: name,
			price: price,
			vprice: vprice,
			pic: pic,
			stock: stock,
			des: des,
			seller: seller
		},
		dataType: "json",
		success: function(msg) {
			document.getElementById("update_goods_name").value="";
			document.getElementById("update_goods_price").value="";
			document.getElementById("update_goods_Vprice").value="";
			document.getElementById("update_goods_pic").value="";
			document.getElementById("update_goods_instock").value="";
			document.getElementById("update_goods_des").value="";
			document.getElementById("update_goods_seller").value="";
	},
		error: function(msg) {
		}
	});
	getItemDB();
}

//add new good in Database
function add_goodsDB(){
	let name=document.getElementById("update_goods_name").value;
	let price=document.getElementById("update_goods_price").value;
	let vprice=document.getElementById("update_goods_Vprice").value;
	let pic=document.getElementById("update_goods_pic").value;
	let stock=document.getElementById("update_goods_instock").value;
	let des=document.getElementById("update_goods_des").value;
	let seller=document.getElementById("update_goods_seller").value;
	let id=item_names.length;
	$.ajax({
		type: "post",
		url: "updateItem.php",
		data: {
			name: name,
			price: price,
			vprice: vprice,
			pic: pic,
			stock: stock,
			des: des,
			seller: seller,
			id: id
		},
		dataType: "json",
		success: function(msg) {
			document.getElementById("update_goods_name").value="";
			document.getElementById("update_goods_price").value="";
			document.getElementById("update_goods_Vprice").value="";
			document.getElementById("update_goods_pic").value="";
			document.getElementById("update_goods_instock").value="";
			document.getElementById("update_goods_des").value="";
			document.getElementById("update_goods_seller").value="";
	},
		error: function(msg) {
		}
	});
	getItemDB();
}
