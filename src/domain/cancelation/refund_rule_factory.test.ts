import { FullRefund } from "./full_refund";
import { NoRefund } from "./no_refund";
import { PartialRefund } from "./partial_refund";
import { RefundRuleFactory } from "./refund_rule_factory";

describe("RefundRuleFactory", () => {
  it("Should return FullRefund when daysUntilCheckIn is greater than 7", () => {
    const refundRule = RefundRuleFactory.getRefundRule(8);
    expect(refundRule).toBeInstanceOf(FullRefund);
  });

  it("Should return PartialRefund when daysUntilCheckIn is between 1 and 7", () => {
    const refundRule = RefundRuleFactory.getRefundRule(3);
    expect(refundRule).toBeInstanceOf(PartialRefund);
  });

  it("Should return NoRefund when daysUntilCheckIn is less than 1", () => {
    const refundRule = RefundRuleFactory.getRefundRule(0);
    expect(refundRule).toBeInstanceOf(NoRefund);
  });
});
