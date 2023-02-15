resource "aws_dynamodb_table" "basic-dynamodb-table" {
  name           = "wdc-icon-generator-dlc"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "pk"
  range_key      = "sk"
  table_class    = "STANDARD"

  attribute {
    name = "pk"
    type = "S"
  }

  attribute {
    name = "sk"
    type = "S"
  }
}