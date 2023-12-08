import { Injectable } from '@angular/core';
import { AngularFireDatabase, SnapshotAction } from '@angular/fire/compat/database';

import { Observable } from 'rxjs';
import { Empleado, EmpleadoWithKey } from '../models/empleado';
import { map } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {
 
  private empleados$: Observable<{ key: string | null, 
    Nombre: string, 
    Apellido: string, 
    DNI: number, 
    Domicilio: string }[]>;

    constructor(private db: AngularFireDatabase) {
      this.empleados$ = this.db.list('/Empleado').snapshotChanges().pipe(
        map(changes => {
          return changes.map(c => {
            const data = c.payload.val() as Empleado;
            const key = c.payload.key;
            return { key, ...data };
          });
        })
      );
    }
  
    getEmpleados(): Observable<{ key: string | null, Nombre: string, Apellido: string, DNI: number, Domicilio: string }[]> {
      return this.empleados$;
    }

    // Método para agregar un nuevo empleado a la base de datos
    agregarEmpleado(empleado: Empleado): Promise<void> {
       // Usar la función then() para resolver la Promise
       return this.db.list('/Empleado').push(empleado).then(() => {});
    } 

     // Método para eliminar un empleado de la base de datos
      eliminarEmpleado(empleadoId: string): Promise<void> {
        return this.db.list('/Empleado').remove(empleadoId);
      }

      getEmpleadoById(empleadoId: string): Observable<EmpleadoWithKey | null> {
        return this.empleados$.pipe(
          map(empleados => empleados.find(empleado => empleado.key === empleadoId) || null)
        );
      }

      editarEmpleado(empleado: EmpleadoWithKey): Promise<void> {
        const empleadoId = empleado.key;
        if (!empleadoId) {
          // No hay clave, no se puede editar
          return Promise.reject('No se proporcionó una clave válida para editar el empleado.');
        }
    
        return this.db.list('/Empleado').update(empleadoId, empleado).then(() => {});
      }
    
}
