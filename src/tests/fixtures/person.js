"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Person = (function () {
    function Person(first, last) {
        this.first = first;
        this.last = last;
        this.dob = new Date(1e12);
    }
    Person.prototype.toJSON = function () {
        return {
            '@@Person': this.first + " " + this.last,
            dob: this.dob
        };
    };
    return Person;
}());
exports.Person = Person;
exports.person = new Person('Benton', 'Chase');
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGVyc29uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicGVyc29uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7SUFHRSxnQkFBbUIsS0FBYSxFQUFTLElBQVk7UUFBbEMsVUFBSyxHQUFMLEtBQUssQ0FBUTtRQUFTLFNBQUksR0FBSixJQUFJLENBQVE7UUFGckQsUUFBRyxHQUFHLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBR3JCLENBQUM7SUFFRCx1QkFBTSxHQUFOO1FBQ0UsTUFBTSxDQUFDO1lBQ0wsVUFBVSxFQUFLLElBQUksQ0FBQyxLQUFLLFNBQUksSUFBSSxDQUFDLElBQU07WUFDeEMsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHO1NBQ2QsQ0FBQztJQUNKLENBQUM7SUFDSCxhQUFDO0FBQUQsQ0FBQyxBQVpELElBWUM7QUFaWSx3QkFBTTtBQWNOLFFBQUEsTUFBTSxHQUFHLElBQUksTUFBTSxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQyJ9