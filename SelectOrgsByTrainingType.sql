USE [Flow]
GO
/****** Object:  StoredProcedure [dbo].[TrainingOrgCertifications_SelectByTrainingType]    Script Date: 9/15/2022 11:08:53 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER   PROC [dbo].[TrainingOrgCertifications_SelectByTrainingType]
			@PageIndex int
			,@PageSize int
			,@CertId int

AS

/*---- TEST CODE ----

	DECLARE @PageIndex int = 0
		,@PageSize int = 2
		,@CertId int = 6

	EXECUTE dbo.TrainingOrgCertifications_SelectByTrainingType
		@PageIndex
		,@PageSize
		,@CertId

		SELECT *
		From dbo.TrainingOrgCertifications

---- END TEST CODE ----
*/

BEGIN

	DECLARE @Offset int = @PageIndex * @PageSize

	SELECT org.Id
		   ,org.Name
		   ,tror.CertificationTypeId
		   ,ct.Name
		   ,org.Description
		   ,org.Logo
		   ,org.BusinessPhone
		   ,loc.LineOne
		   ,loc.LineTwo
		   ,loc.City
		   ,loc.Zip
		   ,st.Name
		   ,org.SiteUrl
		   ,TotalCount = COUNT (1) OVER()

	FROM [dbo].[Organizations] as org
	inner join dbo.TrainingOrgCertifications as tror on tror.OrganizationId = org.Id
	inner join dbo.CertificationTypes as ct on tror.CertificationTypeId = ct.Id
	inner join dbo.Locations as loc on org.PrimaryLocationId = loc.Id
	inner join dbo.States as st on loc.StateId = st.Id
	WHERE @CertId = CertificationTypeId
		

	ORDER BY [OrganizationId]
		OFFSET @OffSet Rows
	FETCH NEXT @PageSize Rows ONLY

END
