package com.salesmanagement.salesmanagement.entities;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "tb_sales")
public class Sale {
	
	
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private int numSale;
	private int numTable;
	private String[] items;
	private String date;
	private String time;
	
	
	public Sale() {
	}


	public int getNumSale() {
		return numSale;
	}


	public void setNumSale(int numSale) {
		this.numSale = numSale;
	}


	public Long getId() {
		return id;
	}


	public void setId(Long id) {
		this.id = id;
	}


	public int getNumTable() {
		return numTable;
	}


	public void setNumTable(int numTable) {
		this.numTable = numTable;
	}


	public String[] getItems() {
		return items;
	}


	public void setItems(String[] items) {
		this.items = items;
	}


	public String getDate() {
		return date;
	}


	public void setDate(String date) {
		this.date = date;
	}


	public String getTime() {
		return time;
	}


	public void setTime(String time) {
		this.time = time;
	}
	
	

}
