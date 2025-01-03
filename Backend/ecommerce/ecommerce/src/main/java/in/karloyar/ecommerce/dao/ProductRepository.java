package in.karloyar.ecommerce.dao;

import in.karloyar.ecommerce.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestParam;

@Repository
@CrossOrigin

public interface ProductRepository extends JpaRepository<Product, Long> {
    Page<Product> findByCategoryId(@Param("id") Long id , Pageable pageable );

    Page<Product> findByNameContaining(@RequestParam("name")String name, Pageable pageable);

}

//verify : http://localhost:8080/products/search/findByNameContaining?name=mug