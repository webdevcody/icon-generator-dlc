terraform {
 backend "s3" {
   bucket         = "icon-generator-dlc-terraform-state"
   key            = "state/terraform.tfstate"
   region         = "us-east-1"
   dynamodb_table = "wdc-icon-generator-dlc-state"
 }
}
