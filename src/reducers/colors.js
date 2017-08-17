const colors = (state = new Uint8ClampedArray(640000), action) => {
  switch (action.type) {
    case 'CHANGE_COLOR':
      if (state.length !== 0) {
        const index_i = action.i * 4
        const index_j = action.j * 4
        var index;
        if (index_i > 0) {
          index = (index_i )*400 + index_j
        } else {
          index = index_i + index_j
        }
        // const index = (index_i )*50 + index_j
        switch (action.c) {
          case 0:
            // color = [255, 255, 255, 255];
            state[index]      = 255;
            state[index + 1]  = 255;
            state[index + 2]  = 255;
            state[index + 3]  = 255;
            break;
          case 1:
            // color = [228, 228, 228, 255];
            state[index]      = 228;
            state[index + 1]  = 228;
            state[index + 2]  = 228;
            state[index + 3]  = 255;
            break;
          case 2:
            // color = [136, 136, 136, 255];
            state[index]      = 136;
            state[index + 1]  = 136;
            state[index + 2]  = 136;
            state[index + 3]  = 255;
            break;
          case 3:
            // color =  [34, 34, 34, 255];
            state[index]      = 34;
            state[index + 1]  = 34;
            state[index + 2]  = 34;
            state[index + 3]  = 255;
            break;
          case 4:
            // color = [255, 167, 209, 255];
            state[index]      = 255;
            state[index + 1]  = 167;
            state[index + 2]  = 209;
            state[index + 3]  = 255;
            break;
          case 5:
            // color = [229, 0, 0, 255];
            state[index]      = 229;
            state[index + 1]  = 0;
            state[index + 2]  = 0;
            state[index + 3]  = 255;
            break;
          case 6:
            // color = [229, 149, 0, 255];
            state[index]      = 229;
            state[index + 1]  = 149;
            state[index + 2]  = 0;
            state[index + 3]  = 255;
            break;
          case 7:
            // color = [160, 106, 66, 255];
            state[index]      = 160;
            state[index + 1]  = 106;
            state[index + 2]  = 66;
            state[index + 3]  = 255;
            break;
          case 8:
            // color = [229, 217, 0, 255];
            state[index]      = 229;
            state[index + 1]  = 217;
            state[index + 2]  = 0;
            state[index + 3]  = 255;
            break;
          case 9:
            // color = [148, 224, 68, 255];
            state[index]      = 148;
            state[index + 1]  = 224;
            state[index + 2]  = 68;
            state[index + 3]  = 255;
            break;
          case 10:
            // color = [2, 190, 1, 255];
            state[index]      = 2;
            state[index + 1]  = 190;
            state[index + 2]  = 1;
            state[index + 3]  = 255;
            break;
          case 11:
            // color = [0, 211, 221, 255];
            state[index]      = 0;
            state[index + 1]  = 211;
            state[index + 2]  = 221;
            state[index + 3]  = 255;
            break;
          case 12:
            // color = [0, 131, 199, 255];
            state[index]      = 0;
            state[index + 1]  = 131;
            state[index + 2]  = 199;
            state[index + 3]  = 255;
            break;
          case 13:
            // color = [0, 0, 228, 255];
            state[index]      = 0;
            state[index + 1]  = 0;
            state[index + 2]  = 228;
            state[index + 3]  = 255;
            break;
          case 14:
            // color = [207, 110, 228, 255];
            state[index]      = 207;
            state[index + 1]  = 110;
            state[index + 2]  = 228;
            state[index + 3]  = 255;
            break;
          case 15:
            // color = [130, 0, 128, 255];
            state[index]      = 130;
            state[index + 1]  = 0;
            state[index + 2]  = 128;
            state[index + 3]  = 255;
            break;
          default:
            // color = [255, 255, 255, 255];
            state[index]      = 255;
            state[index + 1]  = 255;
            state[index + 2]  = 255;
            state[index + 3]  = 255;
            break;
        }

        return state;
      } else {
        return state;
      }
    case 'GET_BOARD':
      var start = action.payload
      for (var j = 0; j < start.length*4; j += 4) {
          // var color = [255, 255, 255, 255];
          // var meh = new Array(160000)
          switch (start[j/4]) {
            case '0':
              // color = [255, 255, 255, 255];
              state[j]      = 255;
              state[j + 1]  = 255;
              state[j + 2]  = 255;
              state[j + 3]  = 255;
              break;
            case '1':
              // color = [228, 228, 228, 255];
              state[j]      = 228;
              state[j + 1]  = 228;
              state[j + 2]  = 228;
              state[j + 3]  = 255;
              break;
            case '2':
              // color = [136, 136, 136, 255];
              state[j]      = 136;
              state[j + 1]  = 136;
              state[j + 2]  = 136;
              state[j + 3]  = 255;
              break;
            case '3':
              // color =  [34, 34, 34, 255];
              state[j]      = 34;
              state[j + 1]  = 34;
              state[j + 2]  = 34;
              state[j + 3]  = 255;
              break;
            case '4':
              // color = [255, 167, 209, 255];
              state[j]      = 255;
              state[j + 1]  = 167;
              state[j + 2]  = 209;
              state[j + 3]  = 255;
              break;
            case '5':
              // color = [229, 0, 0, 255];
              state[j]      = 229;
              state[j + 1]  = 0;
              state[j + 2]  = 0;
              state[j + 3]  = 255;
              break;
            case '6':
              // color = [229, 149, 0, 255];
              state[j]      = 229;
              state[j + 1]  = 149;
              state[j + 2]  = 0;
              state[j + 3]  = 255;
              break;
            case '7':
              // color = [160, 106, 66, 255];
              state[j]      = 160;
              state[j + 1]  = 106;
              state[j + 2]  = 66;
              state[j + 3]  = 255;
              break;
            case '8':
              // color = [229, 217, 0, 255];
              state[j]      = 229;
              state[j + 1]  = 217;
              state[j + 2]  = 0;
              state[j + 3]  = 255;
              break;
            case '9':
              // color = [148, 224, 68, 255];
              state[j]      = 148;
              state[j + 1]  = 224;
              state[j + 2]  = 68;
              state[j + 3]  = 255;
              break;
            case 'A':
              // color = [2, 190, 1, 255];
              state[j]      = 2;
              state[j + 1]  = 190;
              state[j + 2]  = 1;
              state[j + 3]  = 255;
              break;
            case 'B':
              // color = [0, 211, 221, 255];
              state[j]      = 0;
              state[j + 1]  = 211;
              state[j + 2]  = 221;
              state[j + 3]  = 255;
              break;
            case 'C':
              // color = [0, 131, 199, 255];
              state[j]      = 0;
              state[j + 1]  = 131;
              state[j + 2]  = 199;
              state[j + 3]  = 255;
              break;
            case 'D':
              // color = [0, 0, 228, 255];
              state[j]      = 0;
              state[j + 1]  = 0;
              state[j + 2]  = 228;
              state[j + 3]  = 255;
              break;
            case 'E':
              // color = [207, 110, 228, 255];
              state[j]      = 207;
              state[j + 1]  = 110;
              state[j + 2]  = 228;
              state[j + 3]  = 255;
              break;
            case 'F':
              // color = [130, 0, 128, 255];
              state[j]      = 130;
              state[j + 1]  = 0;
              state[j + 2]  = 128;
              state[j + 3]  = 255;
              break;
            default:
              // color = [255, 255, 255, 255];
              state[j]      = 255;
              state[j + 1]  = 255;
              state[j + 2]  = 255;
              state[j + 3]  = 255;
              break;
          // meh = meh.concat(color)
        }
      }
      return state
    default:
      return state
  }
}

export default colors
