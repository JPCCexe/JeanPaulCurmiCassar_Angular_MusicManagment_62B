import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'stockStatus' })
export class StockStatusPipe implements PipeTransform {
    transform(quantity: number): string {
        if (quantity === 0) {
            return 'Out of Stock';
        } else if (quantity >= 1 && quantity <= 3) {
            return 'Low Stock';
        } else {
            return 'In Stock';
        }
    }
}