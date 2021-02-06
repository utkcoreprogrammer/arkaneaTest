import { Component } from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
	public baseUrl:string ='http://localhost:9090';
	public userForm : any = {
	  fname : '',
	  lname : '',
	  email : '',
	  phone : '',
	  file : ''
	};
  public usersList : any = [];
  userDataObtained : boolean = false;
	constructor(private http: HttpClient){ }

	ngOnInit() {
		this.getUserData();
	}

	getUserData(){
		this.http.get<any>(`${this.baseUrl}/users`).subscribe((res)=>{
			console.log('res from get',res)
			if(res && res.userAvailable && res.users && res.users.length){
				this.usersList = res.users;
				this.userDataObtained= true;
			}
		});
	}

	submitUserForm(){
		console.log(this.userForm,'#############')
		let obj = this.userForm;
		if(this.userForm && this.userForm._id){
			this.http.post<any>(`${this.baseUrl}/user/update`, obj).subscribe((res)=>{
				console.log('res from updated',res)
				if(res && res.updated){
					alert('Updated In Db');
				} else{
					alert('Not updated, there is some error');
				}
			}); 
		} else{
			this.http.post<any>(`${this.baseUrl}/user/register`, obj).subscribe((res)=>{
				console.log('res from register',res)
				if(res && res.added){
					alert('Added in Db');
				} else if(res && res.email_exists){
					alert('Email Already Exists');
				}
			}); 
		}
	
	}


  editUser(formData : any){
	  this.userForm = formData;
	  this.userDataObtained = false;
  }

  deleteUser(_id:any){
	this.http.delete<any>(`${this.baseUrl}/user/delete/`+_id).subscribe((res)=>{
		console.log('res from del',res);
		if(res && res.deleted){
			this.usersList.splice(this.usersList.findIndex((x:any)=>{return x._id === _id}), 1);
			alert('Deleted in Db');
		}
	});

  }

  keypressEvent(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (event.key != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  addImage(event:any){
    console.log(event,'event');
  }

  addUser(){
	this.userDataObtained = false;
	this.userForm= {
		fname : '',
		lname : '',
		email : '',
		phone : '',
		file : ''
	  };
  }

}
