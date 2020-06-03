import { AbstractControl } from '@angular/forms';

export class Customvalidator{
    static emailDomain(domainName: string) {
        return (control: AbstractControl): { [Key: string]: any } | null => {
          const email: string = control.value;
          const Domain = email.substring(email.lastIndexOf('@') + 1);
          if (email === '' || Domain.toLowerCase() === domainName.toLowerCase()) {
            return null;
          } else {
            return { 'emailDomain': true };
          }
        };
        }
}  