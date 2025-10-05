package com.casestudy.bikepartsapi.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BikePart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Article number cannot be null")
    private Long articleNumber;

    @NotBlank(message = "Name is mandatory")
    @Size(min = 3, max = 100, message = "Name must be between 3 and 100 characters")
    private String name;

    @NotBlank(message = "Article category is mandatory")
    private String articleCategory;
    
    @NotBlank(message = "Bicycle category is mandatory")
    private String bicycleCategory;

    @NotBlank(message = "Material is mandatory")
    private String material;

    @NotNull(message = "Net weight cannot be null")
    @Min(value = 1, message = "Weight must be at least 1 gram")
    private Integer netWeight;
}
