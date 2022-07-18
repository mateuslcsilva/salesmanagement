package com.salesmanagement.salesmanagement.controllers;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.salesmanagement.salesmanagement.entities.Sale;
import com.salesmanagement.salesmanagement.services.SaleService;

@RestController
@RequestMapping(value = "/sales")
public class SaleController {
	
	@Autowired
	private SaleService service;
	
	@GetMapping("/all")
	public List<Sale> findSales(){
		return service.findSales();
	}
	
	@PostMapping("/addsale")
	public Sale addSale(@RequestBody Sale sale) {
		return service.saveSale(sale);
	}
	
	@PostMapping("/addsales")
	public List<Sale> addSales(@RequestBody List<Sale> sales){
		return service.saveSales(sales);
	}
	
	@GetMapping("/salebyid/{id}")
	public Sale findSaleById (Long id) {
		return service.getSaleById(id);
	}
	
	@GetMapping("/salebydate/{date}")
	public Sale findSaleByDate (LocalDate Date) {
		return service.getSaleByDate(Date);
	}
	
	@PostMapping("/updatesale")
	public Sale updateSale(@RequestBody Sale sale) {
		return service.updateSale(sale);
	}
	
	@DeleteMapping("/delete/{id}")
	public String deleteProduct (Long id) {
		return service.deleteSale(id);
	}
	
}
