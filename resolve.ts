export class GetAccountDetailsResolver implements Resolve<any[]> {
  constructor(private accountDetailsService: AccountDetailsService) {}

  resolve(route: ActivatedRouteSnapshot): any {
    const accountNo = route.paramMap.get('accountNo');
    const dateNow = new Date();
    let accountDetail;
    return this.accountDetailsService.getAccountDetails(accountNo).pipe(
    
      switchMap((account) => {
        accountDetail = account;
        return this.accountDetailsService
          .getAccountStatement({
            AccountNumber: accountNo,
            FromDate: moment(dateNow).subtract(1, 'months').toISOString(),
            ToDate: dateNow.toISOString(),
          })
          .pipe(
            catchError((error) => {
              console.error('Error fetching account statement:', error);
              return of(error); // Returning an empty array here, you can customize it as needed
            })
          );
      }),
      switchMap((statement) => {
        if (!statement.errorStatus)
          accountDetail.responseObject.statement = statement.responseObject.transactionDetails;
        else 
        accountDetail.responseObject.statement = statement;
        return of(accountDetail);
      })
    );
  }
}
