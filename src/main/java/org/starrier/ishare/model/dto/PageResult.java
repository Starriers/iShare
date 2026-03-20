package org.starrier.ishare.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Generic page response payload.
 *
 * @param <T> data item type
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PageResult<T> {
    private List<T> items;
    private long total;
    private int page;
    private int size;
    private int totalPages;
}
