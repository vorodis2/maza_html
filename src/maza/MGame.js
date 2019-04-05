


var sceneManager, game, mGame
export class MGame {
  	constructor() {
  		var self=this;	
  		var config = {
	        type: Phaser.AUTO,
	        width: 800,
	        height: 600,
	        physics: {
	            default: 'arcade',
	            arcade: {
	                gravity: { x:0, y: 0 }
	            }
	        },
	        scene: {
	            preload: preload,
	            create: create,
	            update: update,
	        }
	    };	    
  		this.game=new Phaser.Game(config);
  		self.menu=undefined
  		self.maze=undefined
  		mGame=this;

  		
  		function preload() {  			
		    this.load.image('background', 'assets/pic/pic0.jpg');
			this.load.spritesheet('pic_0', 'assets/pic/pic_0.png', { frameWidth: 193, frameHeight: 70 });
		    this.load.image('pic_1', 'assets/pic/pic_1.png');
		    this.load.image('pic_2', 'assets/pic/pic_2.png');
		    this.load.image('pic_3', 'assets/pic/pic_3.png');
		    this.load.image('pic_4', 'assets/pic/pic_4.png');
			this.load.image('pic_5', 'assets/pic/pic_5.png');
		}

		function create() {
			
			this.add.tileSprite(self.game.config.width/2, self.game.config.height/2, self.game.config.width, self.game.config.height, 'background');	
			sceneManager=this;
			game=self.game;
			
			self.maze=new MMaze(this.add.container(self.game.config.width/2, self.game.config.height/2));
			self.menu=new MMenu(this.add.container(self.game.config.width/2, self.game.config.height/2),function(){				
				self.menu.setActiv(false);
				self.maze.redrag(30,22);
			});	

					
	    
	    }
	    function update() {
	    	self.maze.update();
	    }


	    ///Дебагер/////////////////////////////////////////
	    var scane= new DCont(document.body);
		var content= new DCont(scane);
		content.x=810;
		content.y=2;
		var aaa=[]
		var y=0
		aaa[y++] = new DButton(content, 0,y*50,"test Menu",function(){
			mGame.menu.setActiv(!mGame.menu.activ, Math.random(),Math.random())
		})
		aaa[y++]=new DSliderBig(content, 0,y*50,function(){
			mGame.menu.setActiv(false);			
			mGame.maze.redrag(Math.round(aaa[1].value), Math.round(aaa[2].value))
		},"width",10,100)
		aaa[y-1].value=30;
		aaa[y-1].okrug=1;
		aaa[y++]=new DSliderBig(content, 0,y*50,function(){
			mGame.menu.setActiv(false);
			mGame.maze.redrag(Math.round(aaa[1].value), Math.round(aaa[2].value))
		},"height",10,100)
		aaa[y-1].value=22;
		aaa[y-1].okrug=1;

		aaa[y++] = new DButton(content, 0,y*50,"restart Maze",function(){
			mGame.maze.redrag(Math.round(aaa[1].value), Math.round(aaa[2].value))
		})
		for (var i = 0; i < aaa.length; i++) {
			aaa[i].width=200;
		}
		////////////////////////////////////////////////////
  	}



}




export class MMaze {
	constructor(cont) {
  		this.cont=cont;
  		this.cont.x=0
  		this.cont.y=0
  		this.array=[];
  		this.arrayMaze=[];

  		this.W=24;
		this.H=24;

		this.kolW=21;
		this.kolH=21;

  		/*var block = sceneManager.add.tileSprite(100, 100, 32 * 4, 32 * 2, 'crate');

	    sceneManager.physics.add.existing(block, false);

	    block.body.setVelocity(130, 180);
	    block.body.setBounce(1, 1);
	    block.body.setCollideWorldBounds(true);

	    //  Our static TileSprite that will just receive collide events
	    var staticBlock = sceneManager.add.tileSprite(400, 300, 32 * 3, 32 * 8, 'crate');

	    sceneManager.physics.add.existing(staticBlock, true);*/

		
	    this.person=new MPerson(this);
	    this.generatArray = new GeneratArray();
		



	    this.claer=function(){
	    	this.person.activ=false;
	    	for (var i = 0; i < this.array.length; i++) {	    		
	    		this.array[i].activ=false;
	    	}
	    }
	    var box;
	    this.redrag=function( w, h){
	    	

	    	this.kolW=Math.ceil(w/2)*2 +1;
	    	this.kolH=Math.ceil(h/2)*2 +1;

			this.claer()
	    	this.generatArray.generat(this.kolW, this.kolH);
        	this.arrayMaze = this.generatArray.values;

	    	for (var i = 0; i < this.arrayMaze.length; i++) {	    		
	    		for (var j = 0; j < this.arrayMaze[i].length; j++) {
	    			if(this.arrayMaze[i][j]==0){
	    				box=this.addObj();
	    				box.x=i*this.W+this.W;
	    				box.y=j*this.H+this.H;	   				
	    			}	
	    			if(this.arrayMaze[i][j]==9998){//персонаж
	    				this.person.activ=true;
	    				this.person.x=i*this.W+this.W;
	    				this.person.y=j*this.H+this.H;
	    			}
	    			if(this.arrayMaze[i][j]==9999){
	    				this.person.setClose(i*this.W+this.W*1.5, j*this.H+this.H*1.5)  	
	    			}
	    			
	    			//		
	    		}
	    	}
	    }

		this.addObj=function(){
			for (var i = 0; i < this.array.length; i++) {
				if(this.array[i].activ==false){
					this.array[i].activ=true
					return this.array[i];
				}
			}

			var b=new MBox(this);			
	    	sceneManager.physics.add.collider(this.person.block, b.block);
	    	this.array.push(b)	    	
	    	return b;
	    } 

	    this.update=function(){
	    	this.person.update()
	    }

	    
  	}


}





export class MBox {
	constructor(mMaze) {
		this._activ=true;
		this._x=0;
		this._y=0;

		this.W=mMaze.W;
		this.H=mMaze.H;
		this.block = sceneManager.add.tileSprite(0, 0, this.W, this.H, 'pic_1');
		mMaze.cont.add(this.block)
		sceneManager.physics.add.existing(this.block, true);
		sceneManager.physics.add.collider(this.block);
	}

  	set x(value) {
  		this._x = value;
  		this.block.body.x=value;
  		this.block.x=value+this.W/2;

  		
  	}	get x() { return  this._x;}

	set y(value) {
		this._y = value;
		this.block.body.y=value;
  		this.block.y=value+this.H/2;
	}	get y() { return  this._y;}


	set activ(value) {
		if(this._activ!=value){
			this._activ = value;
			if(this._activ==false){
				this.x=-444;				
			}
		}		
	}	
	get activ() { return  this._activ;}
}




export class MPerson {
	constructor(mMaze) {
		var self=this;
		this._activ=false;
		this._x=0;
		this._y=0;
		
		this.W=mMaze.W*.5;
		this.H=mMaze.H*.5;


		this.sila=300;
		this.block = sceneManager.add.tileSprite(400, 300, this.W, this.H, 'pic_2');
	    sceneManager.physics.add.existing(this.block, false);
	    this.block.body.setVelocity(0, 0);
	    this.block.body.setBounce(1, 1);
	    this.block.body.setCollideWorldBounds(true);
	    mMaze.cont.add(this.block)


	    this.gameClose = sceneManager.add.tileSprite(0, 0, mMaze.W, mMaze.H, 'pic_3');
	    mMaze.cont.add(this.gameClose)
	    //sceneManager.physics.add.existing(this.block, false);
	    //this.gameClose.body.setVelocity(0, 0);
	    //this.gameClose.body.setBounce(1, 1);
	   // this.gameClose.body.setCollideWorldBounds(true);


	   	this.setClose=function(x,y){
	   		this.gameClose.x=x
	   		this.gameClose.y=y
	   	}

	  

	    this.arrKey=[0,0,0,0]
	    this.vect={x:0,y:0}
	    this.vect1={x:0,y:0}
	    this.vect2={x:0,y:0}
	    this.dragKey=function(){
	    	this.vect.x=0
	    	if(this.arrKey[1]==1){
	    		this.vect.x=1;
	    	}
	    	if(this.arrKey[3]==1)this.vect.x=-1;
	    	this.vect.y=0
	    	if(this.arrKey[0]==1)this.vect.y=-1;
	    	if(this.arrKey[2]==1)this.vect.y=1;



	    	/*this.block.body.setGravity(this.vect.x*this.sila,this.vect.y*this.sila);
	    	this.block.body.setVelocity(this.vect.x*this.sila,this.vect.y*this.sila);
	    	if(this.vect.x==0&&this.vect.y==0){
	    		this.block.body.setVelocity(0, 0);
	    		this.block.body.setGravity(0,0);
	    	}*/
	    }



	    this.mousemove=function(e){
	    	
	    	self.vect1.x=self.block.body.x
	    	self.vect1.y=self.block.body.y

	    	self.vect2.x=e.clientX-self.W
	    	self.vect2.y=e.clientY-self.H

	    	var dist = Math.sqrt(Math.pow((self.vect2.x - self.vect1.x), 2) + Math.pow((self.vect2.y - self.vect1.y), 2));  

	    	self.vect.x=0;
	    	self.vect.y=0;
	    	if(dist>10){
	    		var a= self.getAngle(self.vect1, self.vect2)

	    		self.getVector(1, a,self.vect);
	    	}  	



	    	
	    }

	    this.mouseup=function(e){
	    	self.vect.x=0;
	    	self.vect.y=0;	    	
	    	document.removeEventListener("mousemove", self.mousemove);
	    	document.removeEventListener("mouseup", self.mouseup);
	    }

	    document.addEventListener('mousedown', (e) => { 
	    	this.mousemove(e);
	    	document.addEventListener("mousemove", this.mousemove);
	    	document.addEventListener("mouseup", this.mouseup);

	    })

	    document.addEventListener('keydown', (event) => {    
	    	if(event.keyCode==38||event.keyCode==87)this.arrKey[0]=1;
	    	if(event.keyCode==68||event.keyCode==39)this.arrKey[1]=1;
	    	if(event.keyCode==83||event.keyCode==40)this.arrKey[2]=1;
			if(event.keyCode==65||event.keyCode==37)this.arrKey[3]=1;
			this.dragKey()
	    })

	 	document.addEventListener('keyup', (event) => {	    	

	    	if(event.keyCode==38||event.keyCode==87)this.arrKey[0]=0;
	    	if(event.keyCode==68||event.keyCode==39)this.arrKey[1]=0;
	    	if(event.keyCode==83||event.keyCode==40)this.arrKey[2]=0;
			if(event.keyCode==65||event.keyCode==37)this.arrKey[3]=0;
			this.dragKey()
	    }) 

	 	this.sah=0;
	 	this.date;
	 	this.tOld=0
	 	var distSah=10;
	 	var v3={x:0,y:0}
	 	var v2={x:0,y:0}
	 	this.dvigaemSah=function(){
	        if (this.sah == 0){
	            v3.x = v2.x;
	            v3.y = v2.y;
	            this.sah = 1;
	        }
	        v2.x=self.block.body.x
	        v2.y=self.block.body.y
	        var dist = Math.sqrt(Math.pow((v3.x - v2.x), 2) + Math.pow((v3.y - v2.y), 2));

	         if(dist> distSah) {
	            v3.x = v2.x;
	            v3.y = v2.y;
	
	            this.sah++;
	        }

	       	dist = Math.sqrt(Math.pow((self.block.body.x - self.gameClose.x), 2) + Math.pow((self.block.body.y - self.gameClose.y), 2));
	        
	       	
	        if (dist < 15){//выйграли
	            //finish();
	            //Glaf.setEventMy(null, "yra", 0f);
	            this._activ=false;
	            this.block.body.setVelocity(0, 0);
	    		this.block.body.setGravity(0,0);
	    		
	    		this.date = new Date();
	    		var t=this.date.getTime()-this.tOld;
	            mGame.menu.setActiv(true, Math.round(t/1000), this.sah)
	        }
   		}




	 	this.update=function(){
	 		if(this._activ==false)return;
	 		this.block.body.setGravity(this.vect.x*this.sila,this.vect.y*this.sila);
	 		this.block.body.setVelocity(this.vect.x*this.sila,this.vect.y*this.sila);
	    	if(this.vect.x==0&&this.vect.y==0){
	    		this.block.body.setVelocity(0, 0);
	    		this.block.body.setGravity(0,0);
	    	}
	    	this.dvigaemSah()

	    }
	    this.getAngle = function (a, b) {
			b = b || rezNull;
			a = a || rezNull;
			return Math.atan2(b.y - a.y, b.x - a.x);
		};

		this.getDistance = function (p1, p2) {
			if (p1 == undefined) {
				return 0;
			}
			if (p2 == undefined) {
				p2 = rezNull;
			}
			p2 = p2 || rezNull;
			return Math.sqrt(Math.pow((p1.x - p2.x), 2) + Math.pow((p1.y - p2.y), 2));
		};

		this.getVector = function (length, angle, point) {
			if (point == undefined) var point = {x:0,y:0};
			if (length < 0) angle += Math.PI;
			point.x = Math.abs(length) * Math.cos(angle);
			point.y = Math.abs(length) * Math.sin(angle);
			return point;
		};
	}


  	set x(value) {
  		this._x = value;
  		this.block.body.x=value;
  		this.block.x=value+this.W/2;

  		
  	}	get x() { return  this._x;}

	set y(value) {
		this._y = value;
		this.block.body.y=value;
  		this.block.y=value+this.H/2;
	}	get y() { return  this._y;}

	set activ(value) {
		if(this._activ!=value){
			this._activ = value;
			this.date = new Date();
			this.tOld=this.date.getTime();
			if(this._activ==false){
				this.sah=0;
				this.block.body.setVelocity(0, 0);				
			}
		}		
	}	
	get activ() { return  this._activ;}
}






export class GeneratArray {
	constructor() {
		this.values	= [];

		this.kolW=10
		this.kolH=10
		this.sahRec=0;
		this.generat=function(_kolW, _kolH){


	        this.kolW = _kolW;
	        this.kolH = _kolH;
	        this.values = [];
	        
	        this.generikArray1();//сетка
	        var ww=Math.round(this.kolW / 2);	                
	        var hh=Math.round(this.kolH / 2);
	        if(this.values[ww][hh]==0)ww++
	        if(this.values[ww][hh]==0)hh--	

	        this.generikXZ(ww, hh, false);
	        //this.generikXZ(ww, hh, false);
	        //заполняем остаток 
	        this.sahRec=0;
	        this.generikTestOnre();
	        //Сборка массы, то есть находим самый удаленый от центра   
	        this.generikXZ55(ww, hh, 1);	        
	        this.generikXZ66();//Делаем дырку в заборе 
	        this.values[ww][hh] = 9998;
	    }

	    this.generikArray1=function(){	    	
	        for (var i = 0; i < this.kolW; i++) {
	            this.values[i]=[]
	            for (var j = 0; j < this.kolH; j++){
	                if ((i % 2 != 0 && j % 2 != 0)){
	                    this.values[i][j]=1;
	                }
	                else {
	                    this.values[i][j]=0;
	                }
	            }
	        }
	    }


	    this.generikTestOnre=function(){	
	        var  testb = false;
	        this.sahRec++;
	       
	        for (var i = 1; i < this.kolW; i += 2) {
	            for (var j = 1; j < this.kolH; j += 2) {
	                if (this.values[i][j] == 1) {
	                    testb = true;
	                    break;
	                }
	            }
	        }
 			if(this.sahRec==100){

 				return
 			}

	        if (testb == true) {
	            this.generikXZ33();
	            //зачистка одиночек    
	            this.generikXZ44();
	            this.generikTestOnre();
	        }
	    }

	    //зачистка одиночек, пробиваем <<<>>> и кидаем на оброботку поиска    
	   this.generikXZ44=function(){	
	        for (var i = 1; i < this.kolW; i += 2){
	            for (var j = 1; j < this.kolH; j += 2){
	                if (this.values[i][j] == 1)
	                {
	                    if (i - 1 != 0)
	                    {
	                        this.values[i - 1][j] = 2;
	                        this.generikXZ(i, j, true);
	                    }
	                    else
	                    {
	                        if (i + 1 != this.kolW)
	                        {
	                            this.values[i + 1][j] = 2;
	                            this.generikXZ(i, j, true);
	                        }
	                    }
	                    this.values[i][j] = 2;
	                }
	            }
	        }
    	}

    	//зачистка одиночек
    	this.generikXZ55=function(i, j, mass){	   
	        if (this.values[i][j] == 2){
	            this.values[i][j] = this.values[i][j] + mass;
	            mass++;
	            if (this.values[i + 1][j] == 2) this.generikXZ55(i + 1, j, mass);
	            if (this.values[i - 1][j] == 2) this.generikXZ55(i - 1, j, mass);
	            if (this.values[i][j - 1] == 2) this.generikXZ55(i, j - 1, mass);
	            if (this.values[i][j + 1] == 2) this.generikXZ55(i, j + 1, mass);
	        }
	    }

	    //durka в заборе, то есть по контуру очищаем самый дальний  
	    this.generikXZ66=function(){
	        var  max = 0;
	        var  ii = 0;
	        var  jj = 0;
	        for (var i = 1; i < this.kolW - 1; i++)
	        {
	            for (var j = 1; j < this.kolH - 1; j++)
	            {
	                if (this.values[i][j] > 2)
	                {
	                    if (max < this.values[i][j])
	                    {
	                        max = this.values[i][j];
	                        ii = i;
	                        jj = j;
	                    }
	                }
	            }
	        }
	        var okBool = false;

	        if (ii == 1)
	        {
	            this.values[ii - 1][jj] = 9999;
	            okBool = true;
	        }
	        if (ii == this.kolW - 2 && okBool == false)
	        {
	            this.values[ii + 1][jj] = 9999;
	            okBool = true;
	        }
	        if (jj == 1 && okBool == false)
	        {
	            this.values[ii][jj - 1] = 9999;
	            okBool = true;
	        }
	        if (jj == this.kolH - 2 && okBool == false)
	        {
	            this.values[ii][jj + 1] = 9999;
	            okBool = true;
	        }

	        if (okBool == false)
	        {
	            this.values[ii][jj] = 2;
	            this.generikXZ66();
	        }
	    }




	     //каждого на проверку контура
    	this.generikXZ33=function(){	
	        for (var i = 1; i < this.kolW; i += 2){
	            for (var j = 1; j < this.kolH; j += 2) {
	                if (this.values[i][j] == 2){
	                    this.generikXZ(i, j, true);
	                }
	            }
	        }
		}




	   

	    this.generikXZ=function(i, j, sosed) {
	        if (this.values[i][j] != 2 || sosed == true) {
	            this.values[i][j] = 2;
	            var rNap = Math.round(Math.random()*4);
	            this.generikXZ2(i, j, rNap, 4, sosed);
	        }
	    }



		//по кругу гоняем на поиск линии
	    this.generikXZ2=function(i, j, rNap, sah, sosed)
	    {
	        switch (rNap)
	        {
	            case 0://>>>>>>
	                if (this.values[i + 1][j] == 0 && i + 2 < this.kolW && this.values[i + 2][j] != 2)
	                {
	                    this.values[i + 1][j] = 2;
	                    this.generikXZ(i + 2, j, false);
	                    if (sosed == false) sah = 0;
	                }
	                break;
	            case 1://низ
	                if (this.values[i][j + 1] == 0 && j + 2 < this.kolH && this.values[i][j + 2] != 2)
	                {
	                    this.values[i][j + 1] = 2;
	                    this.generikXZ(i, j + 2, false);
	                    if (sosed == false) sah = 0;
	                }
	                break;
	            case 2://<<<
	                if (this.values[i - 1][j] == 0 && i - 2 > 0 && this.values[i - 2][j] != 2)
	                {
	                    this.values[i - 1][j] = 2;
	                    this.generikXZ(i - 2, j, false);
	                    if (sosed == false) sah = 0;
	                }
	                break;
	            case 3://верх
	                if (this.values[i][j - 1] == 0 && j - 2 > 0 && this.values[i][j - 2] != 2)
	                {
	                    this.values[i][j - 1] = 2;
	                    this.generikXZ(i, j - 2, false);
	                    if (sosed == false) sah = 0;
	                }
	                break;
	            default:
	                break;
	        }
	        
	        sah--;
	        if (sah >= 0)
	        {
	            var rN = (rNap - 1);
	            if (rN < 0) rN = 3 - rN;
	            this.generikXZ2(i, j, rN, sah, false);
	        }
	    }
	}

	


}












export class MMenu {
  	constructor(cont, fun) {
  		this.cont=cont;

  		this.activ=true;



  		this.sceneManager=sceneManager;  
  		this.cont.add( sceneManager.add.sprite(0, 0, 'pic_4')); 		
  		this.cont.add( sceneManager.add.sprite(0, 0, 'pic_5')); 		
  		


  		var label=new Label(this.cont, -90, -100, 'time:0')
 		var label1=new Label(this.cont, -90, -60, 'step:0')




  		new Button(this.cont, 0,50,'pic_0', function(){

  			fun()
  		})  		
  	

  		this.setActiv=function(b, t, s){
  			if(this.activ==b)return;
  			this.activ=b
  			this.cont.visible=this.activ;  			 				
  			label.text="time:"+t;
  			label1.text="step:"+s;  			
  		}

  		
  	}







}

export class Button {
  	constructor(cont,x,y,tip,fun) {
  		var sprite = sceneManager.add.sprite(x,y, 'pic_0').setInteractive();
  		cont.add(sprite);

  		sprite.on('pointerdown', function (event) {
  			 this.setFrame(2);
	       // this.setTint(0xff0000);

	    });
  		sprite.on('pointerup', function (event) {
  			fun();

	    });

  		sprite.on('pointerover', function (event) {
  			 this.setFrame(1);
	       // this.setTint(0xff0000);

	    });

	    sprite.on('pointerout', function (event) {
	    	 this.setFrame(0);
	        //this.clearTint();

	    });


  	}
}
export class Label {
  	constructor(cont,x,y,_text) {
  		this._text=_text
  		var style = {
	        fontSize: '42px',
	        fontFamily: 'Arial',
	        color: '#ffffff',
	        align: 'center',
	        //backgroundColor: '#ff00ff'
	    }
  		this.label = sceneManager.add.text(x, y, this._text, style);
  		cont.add( this.label );
   	}

   	set text(value) {
		if(this._textt!=value){
			this._text = value;
			this.label.text = value;	
		}		
	}	
	get text() { return  this._text;}
}