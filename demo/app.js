import { Set } from "../pkg/set.js";

function assertEq(a, b) {
  if (a !== b) {
    console.error(`${a} != ${b}`);
  } else {
    console.log(`found ${a} === ${b}`);
  }
}

let set = Set.new();
assertEq(
  set.init_deck(),
  '0_0_0_0,0_0_0_1,0_0_0_2,0_0_1_0,0_0_1_1,0_0_1_2,0_0_2_0,0_0_2_1,0_0_2_2,0_1_0_0,0_1_0_1,0_1_0_2,0_1_1_0,0_1_1_1,0_1_1_2,0_1_2_0,0_1_2_1,0_1_2_2,0_2_0_0,0_2_0_1,0_2_0_2,0_2_1_0,0_2_1_1,0_2_1_2,0_2_2_0,0_2_2_1,0_2_2_2,1_0_0_0,1_0_0_1,1_0_0_2,1_0_1_0,1_0_1_1,1_0_1_2,1_0_2_0,1_0_2_1,1_0_2_2,1_1_0_0,1_1_0_1,1_1_0_2,1_1_1_0,1_1_1_1,1_1_1_2,1_1_2_0,1_1_2_1,1_1_2_2,1_2_0_0,1_2_0_1,1_2_0_2,1_2_1_0,1_2_1_1,1_2_1_2,1_2_2_0,1_2_2_1,1_2_2_2,2_0_0_0,2_0_0_1,2_0_0_2,2_0_1_0,2_0_1_1,2_0_1_2,2_0_2_0,2_0_2_1,2_0_2_2,2_1_0_0,2_1_0_1,2_1_0_2,2_1_1_0,2_1_1_1,2_1_1_2,2_1_2_0,2_1_2_1,2_1_2_2,2_2_0_0,2_2_0_1,2_2_0_2,2_2_1_0,2_2_1_1,2_2_1_2,2_2_2_0,2_2_2_1,2_2_2_2'
);

assertEq(set.is_set('0_0_0_0,1_1_1_1,2_2_2_2'), true);
assertEq(set.is_set('0_0_0_1,1_1_1_1,2_2_2_1'), true);
assertEq(set.is_set('0_0_0_1,1_1_1_1,2_2_2_2'), false);

assertEq(
  set.hint(
    '2_0_1_1,1_1_1_0,0_2_1_2,2_1_0_1,2_2_1_0,2_2_0_0,1_2_0_0,1_1_1_2,1_2_0_2,1_2_1_1,2_2_0_1,0_1_0_0'
  ),
  '0_2_1_2,2_2_1_0,1_2_1_1'
);

const board = set.update_board(
  '2_0_1_1,1_1_1_0,2_1_0_1,2_2_0_0,1_2_0_0,1_1_1_2,1_2_0_2,2_2_0_1,0_1_0_0',
  '0_2_1_2,2_2_1_0,1_2_1_1'
)
assertEq(board.sets, 2);
assertEq(board.get_deck(), '');
assertEq(board.get_board(), '0_2_1_2,2_2_1_0,1_2_1_1,2_0_1_1,1_1_1_0,2_1_0_1,2_2_0_0,1_2_0_0,1_1_1_2,1_2_0_2,2_2_0_1,0_1_0_0');
