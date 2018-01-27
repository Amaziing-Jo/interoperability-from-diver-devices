boolean modetext = true;
//compteur pour texte
int k = 0;
//compteur pour ligne martice
int l = 0;
//compteur pour colonne matrice
int m = 0;
//matrice 8x8
byte matrice[8] = {0, 0, 0, 0, 0, 0};

int val = 0;



//the pin to control ROW
const int row1 = 2; // the number of the row pin 9
const int row2 = 3; // the number of the row pin 14
const int row3 = 4; // the number of the row pin 8
const int row4 = 5; // the number of the row pin 12
const int row5 = 17; // the number of the row pin 1
const int row6 = 16; // the number of the row pin 7
const int row7 = 15; // the number of the row pin 2
const int row8 = 14; // the number of the row pin 5
//the pin to control COl
const int col1 = 6; // the number of the col pin 13
const int col2 = 7; // the number of the col pin 3
const int col3 = 8; // the number of the col pin 4
const int col4 = 11; // the number of the col pin 10
const int col5 = 9; // the number of the col pin 6
const int col6 = 10; // the number of the col pin 11
const int col7 = 12; // the number of the col pin 15
const int col8 = 13; // the number of the col pin 16

void displayNum(byte rowNum, int colNum)
{
  int j;
  byte temp = rowNum;
  for (j = 2; j < 6; j++)
  {
    digitalWrite(j, LOW);
  }
  digitalWrite(row5, LOW);
  digitalWrite(row6, LOW);
  digitalWrite(row7, LOW);
  digitalWrite(row8, LOW);
  for (j = 6; j < 14; j++)
  {
    digitalWrite(j, HIGH);
  }
  switch (colNum)
  {
    case 1:
      digitalWrite(col1, LOW);
      break;
    case 2:
      digitalWrite(col2, LOW);
      break;
    case 3:
      digitalWrite(col3, LOW);
      break;
    case 4:
      digitalWrite(col4, LOW);
      break;
    case 5:
      digitalWrite(col5, LOW);
      break;
    case 6:
      digitalWrite(col6, LOW);
      break;
    case 7:
      digitalWrite(col7, LOW);
      break;
    case 8:
      digitalWrite(col8, LOW);
      break;
    default:
      break;
  }
  for (j = 1 ; j < 9; j++)
  {
    temp = (0x80) & (temp) ;
    if (temp == 0)
    {
      temp = rowNum << j;
      continue;
    }
    switch (j)
    {
      case 1: digitalWrite(row1, HIGH); break;
      case 2: digitalWrite(row2, HIGH); break;
      case 3: digitalWrite(row3, HIGH); break;
      case 4: digitalWrite(row4, HIGH); break;
      case 5: digitalWrite(row5, HIGH); break;
      case 6: digitalWrite(row6, HIGH); break;
      case 7: digitalWrite(row7, HIGH); break;
      case 8: digitalWrite(row8, HIGH); break;
      default: break;
    }
    temp = rowNum << j;
  }
}


// clear the LCD
void clearLCD() {
  Serial.write(0xFE);
  Serial.write(0x51);
}

// start a new line
void newLine() {
  Serial.write(0xFE);
  Serial.write(0x45);
  Serial.write(0x40);
}

void afficher(char valeur) {
  if (modetext) {
    k++;
    if (k == 17) {
      newLine();
    }
    else if (k == 33) {
      clearLCD();
      k = 0;
    }
    Serial.print(valeur);
  }
}

void setup() {
  // begin the serial communication
  Serial.begin(9600);
  clearLCD();
  int i = 0 ;
  for (i = 2; i < 18; i++)
  {
    pinMode(i, OUTPUT);
  }

  for (i = 2; i < 18; i++) {
    digitalWrite(i, LOW);
  }
}


/*
 * Le switch permet de vérifier dans quel mode se trouve l'arduino soit
 * en mode teste pour afficher sur le display 16x2
 * en mode matrice 8x8 pour dessiner une forme
 */

void loop() {
  if (Serial.available() > 0) {
    char valeur = Serial.read();
    switch (valeur) {
      case ';':
        clearLCD();
        modetext = true;
        k = 0;
        break;
      case '$':
        modetext = false;
        m = 0;
        break;
      case '0':
        if (!modetext) {
          if (l == 0) {
            val = 0;
            l++;
          }
          else if (l == 1) {
            val = val + 0;
            matrice[m] = byte(val);
            m++;
            l = 0;
          }
        }
        else if (modetext) {
          afficher(valeur);
        }
        break;
      case '1':
        if (!modetext) {
          if (l == 0) {
            val = 16;
            l++;
          }
          else if (l == 1) {
            val = val + 1;
            matrice[m] = byte(val);
            m++;
            l = 0;
          }
        }
        else if (modetext) {
          afficher(valeur);
        }
        break;
      case '2':
        if (!modetext) {
          if (l == 0) {
            val = 32 ;
            l++;
          }
          else if (l == 1) {
            val = val + 2;
            matrice[m] = byte(val);
            m++;
            l = 0;
          }
        }
        else if (modetext) {
          afficher(valeur);
        }
        break;
      case '3':
        if (!modetext) {
          if (l == 0) {
            val = 48 ;
            l++;
          }
          else if (l == 1) {
            val = val + 3;
            matrice[m] = byte(val);
            m++;
            l = 0;
          }
        }
        else if (modetext) {
          afficher(valeur);
        }
        break;
      case '4':
        if (!modetext) {
          if (l == 0) {
            val = 64;
            l++;
          }
          else if (l == 1) {
            val = val + 4;
            matrice[m] = byte(val);
            m++;
            l = 0;
          }
        }
        else if (modetext) {
          afficher(valeur);
        }
        break;
      case '5':
        if (!modetext) {
          if (l == 0) {
            val = 80;
            l++;
          }
          else if (l == 1) {
            val = val + 5;
            matrice[m] = byte(val);
            m++;
            l = 0;
          }
        }
        else if (modetext) {
          afficher(valeur);
        }
        break;
      case '6':
        if (!modetext) {
          if (l == 0) {
            val = 96;
            l++;
          }
          else if (l == 1) {
            val = val + 6;
            matrice[m] = byte(val);
            m++;
            l = 0;
          }
        }
        else if (modetext) {
          afficher(valeur);
        }
        break;
      case '7':
        if (!modetext) {
          if (l == 0) {
            val = 112;
            l++;
          }
          else if (l == 1) {
            val = val + 7;
            matrice[m] = byte(val);
            m++;
            l = 0;
          }
        }
        else if (modetext) {
          afficher(valeur);
        }
        break;
      case '8':
        if (!modetext) {
          if (l == 0) {
            val = 128;
            l++;
          }
          else if (l == 1) {
            val = val + 8;
            matrice[m] = byte(val);
            m++;
            l = 0;
          }
        }
        else if (modetext) {
          afficher(valeur);
        }
        break;
      case '9':
        if (!modetext) {
          if (l == 0) {
            val = 144;
            l++;
          }
          else if (l == 1) {
            val = val + 9;
            matrice[m] = byte(val);
            m++;
            l = 0;
          }
        }
        else if (modetext) {
          afficher(valeur);
        }
        break;
      case 'a':
        if (!modetext) {
          if (l == 0) {
            val = 160;
            l++;
          }
          else if (l == 1) {
            val = val + 10;
            matrice[m] = byte(val);
            m++;
            l = 0;
          }
        }
        else if (modetext) {
          afficher(valeur);
        }
        break;
      case 'b':
        if (!modetext) {
          if (l == 0) {
            val = 176;
            l++;
          }
          else if (l == 1) {
            val = 11;
            matrice[m] = byte(val);
            m++;
            l = 0;
          }
        }
        else if (modetext) {
          afficher(valeur);
        }
        break;
      case 'c':
        if (!modetext) {
          if (l == 0) {
            val = 192;
            l++;
          }
          else if (l == 1) {
            val = val + 12;
            matrice[m] = byte(val);
            m++;
            l = 0;
          }
        }
        else if (modetext) {
          afficher(valeur);
        }
        break;
      case 'd':
        if (!modetext) {
          if (l == 0) {
            val = 208;
            l++;
          }
          else if (l == 1) {
            val = val + 13;
            matrice[m] = byte(val);
            m++;
            l = 0;
          }
        }
        else if (modetext) {
          afficher(valeur);
        }
        break;
      case 'e':
        if (!modetext) {
          if (l == 0) {
            val = 224;
            l++;
          }
          else if (l == 1) {
            val = val + 14;
            matrice[m] = byte(val);
            m++;
            l = 0;
          }
        }
        else if (modetext) {
          afficher(valeur);
        }
        break;
      case 'f':
        if (!modetext) {
          if (l == 0) {
            val = 240;
            l++;
          }
          else if (l == 1) {
            val = val + 15;
            matrice[m] = byte(val);
            m++;
            l = 0;
          }
        }
        else if (modetext) {
          afficher(valeur);
        }
        break;
      default:
        afficher(valeur);
        break;
    }
  }
  if (m == 8) {
    //for (l = 0; l < 512; l++){
    for (int t1 = 0; t1 < 8; t1++) {
      displayNum(matrice[t1], (t1 + 1));
    }
    //}
  }
}
