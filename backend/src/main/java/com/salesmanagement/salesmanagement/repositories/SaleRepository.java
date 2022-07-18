package com.salesmanagement.salesmanagement.repositories;

import java.time.LocalDate;

import org.springframework.data.jpa.repository.JpaRepository;

import com.salesmanagement.salesmanagement.entities.Sale;

public interface SaleRepository extends JpaRepository<Sale, Long> {
	Sale findByDate(LocalDate date);
}
