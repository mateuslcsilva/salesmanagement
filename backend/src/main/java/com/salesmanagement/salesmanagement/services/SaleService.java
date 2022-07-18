package com.salesmanagement.salesmanagement.services;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.salesmanagement.salesmanagement.entities.Sale;
import com.salesmanagement.salesmanagement.repositories.SaleRepository;

@Service
public class SaleService {
	
	@Autowired
	private SaleRepository repository;
	
	public List<Sale> findSales() {
		return repository.findAll();
	}
	
	public Sale saveSale (Sale sale) {
		return repository.save(sale);
	}
	
	public List<Sale> saveSales (List<Sale> sales) {
		return repository.saveAll(sales);
	}
	
	public Sale getSaleById(Long id) {
		return repository.findById(id).orElse(null);
	}
	
	public Sale getSaleByDate(LocalDate date) {
		return repository.findByDate(date);
	}
	
	public String deleteSale(Long id) {
		repository.deleteById(id);
		return "Venda excluída!!" + id;
	}
	
	public Sale updateSale (Sale sale) {
		Sale existingSale = repository.findById(sale.getId()).orElse(null);
		existingSale.setNumSale(sale.getNumSale());
		existingSale.setNumTable(sale.getNumTable());
		existingSale.setDate(sale.getDate());
		existingSale.setTime(sale.getTime());
		return repository.save(existingSale);
	}


}
