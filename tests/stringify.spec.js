"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ava_1 = require("ava");
var _1 = require("../dist/");
var asjon = new _1.AJSON()
    .addProcessor(_1.jsonPointer)
    .addProcessor(_1.recurseObjects)
    .addProcessor(_1.recurseArrays)
    .addProcessor(_1.recurseMap)
    .addProcessor(_1.recurseSet)
    .addProcessor(_1.specialNumbers)
    .addProcessor(_1.undefinedValue)
    .addProcessor(_1.regexpValue)
    .addProcessor(_1.dateValue)
    .addProcessor(_1.symbolValue);
ava_1.test('all', function (t) {
    var obj = {
        _id: '5aa882d3638a0f580d92c677',
        index: 0,
        name: {
            first: 'Valenzuela',
            last: 'Valenzuela'
        },
        registered: new Date(2014, 0, 1),
        symbol: Symbol('banana'),
        range: [
            -Infinity, 0, 1, 2, 3, 4, 5, 6, 7, 8, Infinity
        ],
        friends: [
            {
                id: -0,
                name: 'Benton Chase'
            },
            {
                id: 1,
                name: 'Mccarthy Morgan'
            },
            {
                id: NaN,
                name: 'Kaufman Price'
            }
        ]
    };
    obj.friends.push(obj);
    obj.friends.push(obj.friends[0]);
    t.snapshot(asjon.stringify(obj));
    // console.log(asjon.stringify(obj, null, 2));
});
ava_1.test('demo', function (t) {
    var foo = function () {
        var FOO = 'foo';
        return function (value) {
            return Array.isArray(value) ? value : FOO;
        };
    };
    var _recurseArrays = function () {
        return function (value, path, next) {
            if (Array.isArray(value)) {
                return value.map(function (v, i) { return next(v, path.concat([i])); });
            }
            return value;
        };
    };
    var _asjon = new _1.AJSON()
        .addProcessor(_1.recurseArrays)
        .addProcessor(foo);
    t.snapshot(_asjon.stringify([1, 2, 3]));
    // console.log(_asjon.stringify([1, 2, 3]));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RyaW5naWZ5LnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzdHJpbmdpZnkuc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDJCQUEyQjtBQUMzQiw2QkFNa0I7QUFFbEIsSUFBTSxLQUFLLEdBQUcsSUFBSSxRQUFLLEVBQUU7S0FDdEIsWUFBWSxDQUFDLGNBQVcsQ0FBQztLQUN6QixZQUFZLENBQUMsaUJBQWMsQ0FBQztLQUM1QixZQUFZLENBQUMsZ0JBQWEsQ0FBQztLQUMzQixZQUFZLENBQUMsYUFBVSxDQUFDO0tBQ3hCLFlBQVksQ0FBQyxhQUFVLENBQUM7S0FDeEIsWUFBWSxDQUFDLGlCQUFjLENBQUM7S0FDNUIsWUFBWSxDQUFDLGlCQUFjLENBQUM7S0FDNUIsWUFBWSxDQUFDLGNBQVcsQ0FBQztLQUN6QixZQUFZLENBQUMsWUFBUyxDQUFDO0tBQ3ZCLFlBQVksQ0FBQyxjQUFXLENBQUMsQ0FBQztBQUU3QixVQUFJLENBQUMsS0FBSyxFQUFFLFVBQUEsQ0FBQztJQUNYLElBQU0sR0FBRyxHQUFHO1FBQ1YsR0FBRyxFQUFFLDBCQUEwQjtRQUMvQixLQUFLLEVBQUUsQ0FBQztRQUNSLElBQUksRUFBRTtZQUNKLEtBQUssRUFBRSxZQUFZO1lBQ25CLElBQUksRUFBRSxZQUFZO1NBQ25CO1FBQ0QsVUFBVSxFQUFFLElBQUksSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ2hDLE1BQU0sRUFBRSxNQUFNLENBQUMsUUFBUSxDQUFDO1FBQ3hCLEtBQUssRUFBRTtZQUNMLENBQUMsUUFBUSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLFFBQVE7U0FDL0M7UUFDRCxPQUFPLEVBQUU7WUFDUDtnQkFDRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO2dCQUNOLElBQUksRUFBRSxjQUFjO2FBQ3JCO1lBQ0Q7Z0JBQ0UsRUFBRSxFQUFFLENBQUM7Z0JBQ0wsSUFBSSxFQUFFLGlCQUFpQjthQUN4QjtZQUNEO2dCQUNFLEVBQUUsRUFBRSxHQUFHO2dCQUNQLElBQUksRUFBRSxlQUFlO2FBQ3RCO1NBQ0Y7S0FDRixDQUFDO0lBRUYsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQU0sR0FBRyxDQUFDLENBQUM7SUFDM0IsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRWpDLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBRWpDLDhDQUE4QztBQUNoRCxDQUFDLENBQUMsQ0FBQztBQUVILFVBQUksQ0FBQyxNQUFNLEVBQUUsVUFBQSxDQUFDO0lBQ1osSUFBTSxHQUFHLEdBQUc7UUFDVixJQUFNLEdBQUcsR0FBRyxLQUFLLENBQUM7UUFDbEIsTUFBTSxDQUFDLFVBQUEsS0FBSztZQUNWLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztRQUM1QyxDQUFDLENBQUM7SUFDSixDQUFDLENBQUM7SUFFRixJQUFNLGNBQWMsR0FBRztRQUNyQixNQUFNLENBQUMsVUFBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLElBQUk7WUFDdkIsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3pCLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSyxPQUFBLElBQUksQ0FBQyxDQUFDLEVBQU0sSUFBSSxTQUFFLENBQUMsR0FBRSxFQUFyQixDQUFxQixDQUFDLENBQUM7WUFDcEQsQ0FBQztZQUNELE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDZixDQUFDLENBQUM7SUFDSixDQUFDLENBQUM7SUFFRixJQUFNLE1BQU0sR0FBRyxJQUFJLFFBQUssRUFBRTtTQUN2QixZQUFZLENBQUMsZ0JBQWEsQ0FBQztTQUMzQixZQUFZLENBQUMsR0FBRyxDQUFDLENBQUM7SUFFckIsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDeEMsNENBQTRDO0FBQzlDLENBQUMsQ0FBQyxDQUFDIn0=